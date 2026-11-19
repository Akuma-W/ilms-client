import { clientApiClient } from '@/lib/api/client-api-client';
import type { Role } from '@/types/enum';
import type { ClassMember } from '@/types/member';
import type { User } from '@/types/user';

export const membersService = {
  // Retrieves all members (teachers, students, pending requests) in a class with double-defense parsing.
  async getMembers(classId: string): Promise<ClassMember[]> {
    try {
      const res = await clientApiClient<ClassMember[] | Record<string, ClassMember>>(
        `/classes/${classId}/members`,
      );
      if (res && res.success !== false && res.data) {
        if (Array.isArray(res.data)) {
          return res.data;
        }
        if (typeof res.data === 'object') {
          return Object.values(res.data) as ClassMember[];
        }
      }
    } catch (err: unknown) {
      console.error('Failed to fetch class members:', err);
    }
    return [];
  },

  // Approves a student's pending enrollment request.
  async approveMember(
    classId: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await clientApiClient<{ message?: string }>(
      `/classes/${classId}/enrollments/${memberId}/approve`,
      { method: 'POST' },
    );
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể phê duyệt sinh viên');
    }
    return { success: true, message: res.message || 'Đã phê duyệt sinh viên vào lớp học!' };
  },

  // Rejects a student's pending enrollment request.
  async rejectMember(
    classId: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await clientApiClient<{ message?: string }>(
      `/classes/${classId}/enrollments/${memberId}/reject`,
      { method: 'POST' },
    );
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể từ chối yêu cầu tham gia lớp');
    }
    return { success: true, message: res.message || 'Đã từ chối yêu cầu tham gia lớp học!' };
  },

  // Removes an enrolled student from the class.
  async removeMember(
    classId: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await clientApiClient<{ message?: string }>(
      `/classes/${classId}/members/${memberId}`,
      { method: 'DELETE' },
    );
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể xóa thành viên');
    }
    return { success: true, message: res.message || 'Đã xóa thành viên khỏi lớp học!' };
  },

  // Updates a member's role (e.g. promoting student to assistant or vice versa).
  async updateMemberRole(
    classId: string,
    memberId: string,
    newRole: Role,
  ): Promise<{ success: boolean; message: string }> {
    const res = await clientApiClient<{ message?: string }>(
      `/classes/${classId}/members/${memberId}/role`,
      {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      },
    );
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể cập nhật vai trò');
    }
    return {
      success: true,
      message:
        res.message ||
        `Đã cập nhật vai trò thành ${newRole === 'teacher' ? 'Trợ giảng' : 'Sinh viên'}!`,
    };
  },

  // Re-approves a previously rejected student request.
  async reApproveMember(
    classId: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await clientApiClient<{ message?: string }>(
      `/classes/${classId}/members/${memberId}/re-approve`,
      { method: 'POST' },
    );
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể chấp nhận lại sinh viên');
    }
    return { success: true, message: res.message || 'Đã chấp nhận lại sinh viên vào lớp học!' };
  },

  // Suspends / bans a student from the class.
  async banMember(
    classId: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    const res = await clientApiClient<{ message?: string }>(
      `/classes/${classId}/members/${memberId}/ban`,
      { method: 'POST' },
    );
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể cấm sinh viên khỏi lớp');
    }
    return { success: true, message: res.message || 'Đã cấm sinh viên khỏi lớp học!' };
  },

  /**
   * Lifts suspension / unbans a student in the class.
   * If resetOnly is true, status is reset to rejected so the student can reapply.
   * If resetOnly is false (default), student is approved directly into the class.
   */
  async unbanMember(
    classId: string,
    memberId: string,
    resetOnly: boolean = false,
  ): Promise<{ success: boolean; message: string }> {
    const res = await clientApiClient<{ message?: string }>(
      `/classes/${classId}/members/${memberId}/unban`,
      {
        method: 'POST',
        body: JSON.stringify({ resetOnly }),
      },
    );
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể gỡ cấm sinh viên');
    }
    return {
      success: true,
      message:
        res.message ||
        (resetOnly
          ? 'Đã gỡ cấm. Sinh viên có thể nộp lại yêu cầu tham gia lớp!'
          : 'Đã gỡ cấm và phê duyệt sinh viên vào lớp học thành công!'),
    };
  },

  // Directly adds an assistant teacher to the class.
  async addAssistant(classId: string, user: User): Promise<{ success: boolean; message: string }> {
    const res = await clientApiClient<{ message?: string }>(
      `/classes/${classId}/members/assistants`,
      {
        method: 'POST',
        body: JSON.stringify({ userId: user.id }),
      },
    );
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể thêm trợ giảng');
    }
    return { success: true, message: res.message || `Đã thêm ${user.fullName} làm trợ giảng lớp!` };
  },
};
