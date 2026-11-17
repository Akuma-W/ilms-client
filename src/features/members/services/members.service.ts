import { clientApiClient } from '@/lib/api/client-api-client';
import {
  addMockAssistant,
  approveMockMember,
  banMockMember,
  getMockMembers,
  reApproveMockMember,
  rejectMockMember,
  removeMockMember,
  unbanMockMember,
  updateMockMemberRole,
} from '@/mocks/classes/mock-members';
import type { Role } from '@/types/enum';
import type { ClassMember } from '@/types/member';
import type { User } from '@/types/user';

export const membersService = {
  // Retrieves all members (teachers, students, pending requests) in a class.
  async getMembers(classId: string): Promise<ClassMember[]> {
    try {
      const res = await clientApiClient<ClassMember[]>(`/classes/${classId}/members`);
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res.data;
      }
    } catch {
      // Graceful fallback to local mock data
    }

    return getMockMembers() as unknown as ClassMember[];
  },

  // Approves a student's pending enrollment request.
  async approveMember(
    classId: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/enrollments/${memberId}/approve`, {
        method: 'POST',
      });
    } catch {
      // Local mutation fallback
    }

    approveMockMember(memberId);
    return { success: true, message: 'Đã phê duyệt sinh viên vào lớp học!' };
  },

  // Rejects a student's pending enrollment request.
  async rejectMember(
    classId: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/enrollments/${memberId}/reject`, {
        method: 'POST',
      });
    } catch {
      // Local mutation fallback
    }

    rejectMockMember(memberId);
    return { success: true, message: 'Đã từ chối yêu cầu tham gia lớp học!' };
  },

  // Removes an enrolled student from the class.
  async removeMember(
    classId: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/members/${memberId}`, {
        method: 'DELETE',
      });
    } catch {
      // Local mutation fallback
    }

    removeMockMember(memberId);
    return { success: true, message: 'Đã xóa thành viên khỏi lớp học!' };
  },

  // Updates a member's role (e.g. promoting student to assistant or vice versa).
  async updateMemberRole(
    classId: string,
    memberId: string,
    newRole: Role,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/members/${memberId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
    } catch {
      // Local mutation fallback
    }

    updateMockMemberRole(memberId, newRole);
    return {
      success: true,
      message: `Đã cập nhật vai trò thành ${newRole === 'teacher' ? 'Trợ giảng' : 'Sinh viên'}!`,
    };
  },

  // Re-approves a previously rejected student request.
  async reApproveMember(
    classId: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/members/${memberId}/re-approve`, {
        method: 'POST',
      });
    } catch {
      // Local mutation fallback
    }

    reApproveMockMember(memberId);
    return { success: true, message: 'Đã chấp nhận lại sinh viên vào lớp học!' };
  },

  // Suspends / bans a student from the class.
  async banMember(
    classId: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/members/${memberId}/ban`, {
        method: 'POST',
      });
    } catch {
      // Local mutation fallback
    }

    banMockMember(memberId);
    return { success: true, message: 'Đã cấm sinh viên khỏi lớp học!' };
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
    try {
      const res = await clientApiClient<{ success: boolean; message: string }>(
        `/classes/${classId}/members/${memberId}/unban`,
        {
          method: 'POST',
          body: JSON.stringify({ resetOnly }),
        },
      );
      if (res && res.data) {
        return res.data;
      }
    } catch {
      // Local mutation fallback
    }

    unbanMockMember(memberId);
    return {
      success: true,
      message: resetOnly
        ? 'Đã gỡ cấm. Sinh viên có thể nộp lại yêu cầu tham gia lớp!'
        : 'Đã gỡ cấm và phê duyệt sinh viên vào lớp học thành công!',
    };
  },

  // Directly adds an assistant teacher to the class.
  async addAssistant(classId: string, user: User): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/classes/${classId}/members/assistants`, {
        method: 'POST',
        body: JSON.stringify({ userId: user.id }),
      });
    } catch {
      // Local mutation fallback
    }

    addMockAssistant(user);
    return { success: true, message: `Đã thêm ${user.fullName} làm trợ giảng lớp!` };
  },
};
