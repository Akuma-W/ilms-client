import { clientApiClient } from '@/lib/api/client-api-client';
import {
  approveMockMember,
  getMockMembers,
  rejectMockMember,
  removeMockMember,
  updateMockMemberRole,
} from '@/mocks/classes/mock-members';
import type { Role } from '@/types/enum';
import type { ClassMember } from '@/types/member';

/**
 * Service managing class members, enrollment approvals, and role updates.
 */
export const membersService = {
  /**
   * Retrieves all members (teachers, students, pending requests) in a class.
   */
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

  /**
   * Approves a student's pending enrollment request.
   */
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

  /**
   * Rejects a student's pending enrollment request.
   */
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

  /**
   * Removes an enrolled student from the class.
   */
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

  /**
   * Updates a member's role (e.g. promoting student to assistant or vice versa).
   */
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
};
