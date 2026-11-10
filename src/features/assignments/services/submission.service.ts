import { clientApiClient } from '@/lib/api/client-api-client';
import type {
  GradeSubmissionPayload,
  Submission,
  SubmitAssignmentPayload,
} from '@/types/assignment';

/**
 * Service managing student submissions and teacher grading.
 * Communicates directly with NestJS backend API.
 */
export const submissionService = {
  /**
   * Submits student work (files and/or text answer) for an assignment.
   */
  async submitAssignment(
    assignmentId: string,
    payload: SubmitAssignmentPayload,
  ): Promise<{ success: boolean; data: Submission; message: string }> {
    try {
      const res = await clientApiClient<Submission>(`/assignments/${assignmentId}/submissions`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return {
          success: true,
          data: res.data,
          message: res.message || 'Nộp bài tập thành công!',
        };
      }
      return {
        success: false,
        data: {} as Submission,
        message: res.message || 'Lỗi khi nộp bài tập',
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Submission,
        message: error instanceof Error ? error.message : 'Lỗi kết nối tới máy chủ',
      };
    }
  },

  /**
   * Updates an existing student submission with new files and/or text answer.
   */
  async updateSubmission(
    submissionId: string,
    payload: SubmitAssignmentPayload,
  ): Promise<{ success: boolean; data: Submission; message: string }> {
    try {
      const res = await clientApiClient<Submission>(`/submissions/${submissionId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return {
          success: true,
          data: res.data,
          message: res.message || 'Cập nhật bài nộp thành công!',
        };
      }
      return {
        success: false,
        data: {} as Submission,
        message: res.message || 'Lỗi khi cập nhật bài nộp',
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Submission,
        message: error instanceof Error ? error.message : 'Lỗi kết nối tới máy chủ',
      };
    }
  },

  /**
   * Grades a student's submission with score and optional feedback.
   */
  async gradeSubmission(
    submissionId: string,
    payload: GradeSubmissionPayload,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await clientApiClient<{ message?: string }>(
        `/submissions/${submissionId}/grade`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
      );
      if (res.success !== false) {
        return { success: true, message: res.message || 'Lưu điểm và nhận xét thành công!' };
      }
      return { success: false, message: res.message || 'Lỗi khi lưu điểm và nhận xét' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối tới máy chủ',
      };
    }
  },

  /**
   * Cancels/unsubmits a student's submission.
   */
  async cancelSubmission(submissionId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await clientApiClient(`/submissions/${submissionId}`, {
        method: 'DELETE',
      });
      if (res.success !== false) {
        return { success: true, message: 'Đã hủy nộp bài tập!' };
      }
      return { success: false, message: res.message || 'Lỗi khi hủy nộp bài tập' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối tới máy chủ',
      };
    }
  },
};
