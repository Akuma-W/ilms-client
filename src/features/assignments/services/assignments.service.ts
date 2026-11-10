import { clientApiClient } from '@/lib/api/client-api-client';
import { submissionService } from './submission.service';
import type {
  Assignment,
  CreateAssignmentPayload,
  SubmitAssignmentPayload,
} from '@/types/assignment';

/**
 * Service handling assignment management, submissions, and grading.
 * Communicates directly with NestJS backend API.
 */
export const assignmentsService = {
  /**
   * Returns initial assignments for SSR or fallback.
   */
  getInitialAssignments(_classId: string, initialList: Assignment[] = []): Assignment[] {
    if (Array.isArray(initialList)) {
      return initialList;
    }
    return [];
  },

  /**
   * Retrieves all assignments for a class.
   */
  async getAssignments(classId: string): Promise<Assignment[]> {
    try {
      const res = await clientApiClient<Assignment[]>(`/assignments/classes/${classId}`);
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        if (Array.isArray(res.data)) {
          return res.data;
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Retrieves a single assignment by its UUID.
   */
  async getAssignmentById(id: string): Promise<Assignment | null> {
    try {
      const res = await clientApiClient<Assignment>(`/assignments/${id}`);
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Creates a new assignment.
   */
  async createAssignment(
    classId: string,
    payload: CreateAssignmentPayload,
  ): Promise<{ success: boolean; data: Assignment; message?: string }> {
    try {
      const res = await clientApiClient<Assignment>(`/assignments/classes/${classId}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return {
          success: true,
          data: res.data,
          message: res.message || 'Giao bài tập thành công!',
        };
      }
      return {
        success: false,
        data: {} as Assignment,
        message: res.message || 'Lỗi khi tạo bài tập',
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Assignment,
        message: error instanceof Error ? error.message : 'Lỗi kết nối tới máy chủ',
      };
    }
  },

  /**
   * Updates an existing assignment.
   */
  async updateAssignment(
    id: string,
    payload: Partial<CreateAssignmentPayload>,
  ): Promise<{ success: boolean; data: Assignment; message?: string }> {
    try {
      const res = await clientApiClient<Assignment>(`/assignments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return {
          success: true,
          data: res.data,
          message: res.message || 'Cập nhật bài tập thành công!',
        };
      }
      return {
        success: false,
        data: {} as Assignment,
        message: res.message || 'Lỗi khi cập nhật bài tập',
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Assignment,
        message: error instanceof Error ? error.message : 'Lỗi kết nối tới máy chủ',
      };
    }
  },

  /**
   * Deletes an assignment.
   */
  async deleteAssignment(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await clientApiClient(`/assignments/${id}`, { method: 'DELETE' });
      if (res.success !== false) {
        return { success: true, message: 'Xóa bài tập thành công!' };
      }
      return { success: false, message: res.message || 'Lỗi khi xóa bài tập' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối tới máy chủ',
      };
    }
  },

  /**
   * Submits student work for an assignment (delegated to submissionService).
   */
  submitAssignment(assignmentId: string, payload: SubmitAssignmentPayload) {
    return submissionService.submitAssignment(assignmentId, payload);
  },
};
