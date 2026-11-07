import { clientApiClient } from '@/lib/api/client-api-client';
import { getLocalAssignments, setLocalAssignments } from './assignments.service';
import type {
  GradeSubmissionPayload,
  Submission,
  SubmitAssignmentPayload,
} from '@/types/assignment';
import type { User } from '@/types/user';

/**
 * Service managing student submissions and teacher grading.
 * Encapsulates backend API integration with graceful mock data fallback.
 */
export const submissionService = {
  /**
   * Submits student work (files and/or text answer) for an assignment.
   */
  async submitAssignment(
    assignmentId: string,
    payload: SubmitAssignmentPayload,
    currentUser?: User | null,
  ): Promise<{ success: boolean; data: Submission; message: string }> {
    try {
      const res = await clientApiClient<Submission>(`/assignments/${assignmentId}/submissions`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return { success: true, data: res.data, message: 'Nộp bài tập thành công!' };
      }
    } catch {
      // Fallback local mutation
    }

    const studentId = currentUser?.id || 'current-student-id';
    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      studentId,
      student: currentUser || undefined,
      textAnswer: payload.textAnswer,
      score: null,
      feedback: null,
      isLate: false,
      submittedAt: new Date().toISOString(),
      files: (payload.files || []).map((f, idx) => ({
        id: `sf-${Date.now()}-${idx}`,
        fileUrl: f.fileUrl,
        fileType: f.fileType,
        fileName: f.fileName,
        fileSize: f.fileSize,
        submissionId: `sub-${Date.now()}`,
      })),
    };

    const currentAssignments = getLocalAssignments();
    const updated = currentAssignments.map((a) => {
      if (a.id === assignmentId) {
        const existing = (a.submissions || []).filter((s) => s.studentId !== studentId);
        return {
          ...a,
          submissions: [newSubmission, ...existing],
          submissionCount: (a.submissionCount || 0) + 1,
        };
      }
      return a;
    });
    setLocalAssignments(updated);

    return { success: true, data: newSubmission, message: 'Nộp bài tập thành công!' };
  },

  /**
   * Updates an existing student submission with new files and/or text answer.
   */
  async updateSubmission(
    assignmentId: string,
    submissionId: string,
    payload: SubmitAssignmentPayload,
    currentUser?: User | null,
  ): Promise<{ success: boolean; data: Submission; message: string }> {
    try {
      const res = await clientApiClient<Submission>(`/submissions/${submissionId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return { success: true, data: res.data, message: 'Cập nhật bài nộp thành công!' };
      }
    } catch {
      // Fallback local mutation
    }

    const currentAssignments = getLocalAssignments();
    let updatedSub: Submission | null = null;
    const updated = currentAssignments.map((a) => {
      if (a.id === assignmentId) {
        const subs = (a.submissions || []).map((s) => {
          if (s.id === submissionId) {
            updatedSub = {
              ...s,
              student: currentUser || s.student,
              textAnswer: payload.textAnswer,
              submittedAt: new Date().toISOString(),
              files: (payload.files || []).map((f, idx) => ({
                id: f.id || `sf-${Date.now()}-${idx}`,
                fileUrl: f.fileUrl,
                fileType: f.fileType,
                fileName: f.fileName,
                fileSize: f.fileSize,
                submissionId,
              })),
            };
            return updatedSub;
          }
          return s;
        });
        return { ...a, submissions: subs };
      }
      return a;
    });
    setLocalAssignments(updated);

    return {
      success: true,
      data: updatedSub || ({} as Submission),
      message: 'Cập nhật bài nộp thành công!',
    };
  },

  /**
   * Grades a student's submission with score and optional feedback.
   */
  async gradeSubmission(
    assignmentId: string,
    submissionId: string,
    payload: GradeSubmissionPayload,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/submissions/${submissionId}/grade`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      // Fallback local mutation
    }

    const currentAssignments = getLocalAssignments();
    const updated = currentAssignments.map((a) => {
      if (a.id === assignmentId) {
        return {
          ...a,
          submissions: (a.submissions || []).map((s) => {
            if (s.id === submissionId) {
              return {
                ...s,
                score: payload.score,
                feedback: payload.feedback || s.feedback,
              };
            }
            return s;
          }),
        };
      }
      return a;
    });
    setLocalAssignments(updated);

    return { success: true, message: 'Lưu điểm và nhận xét thành công!' };
  },

  /**
   * Cancels/unsubmits a student's submission.
   */
  async cancelSubmission(
    assignmentId: string,
    submissionId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await clientApiClient(`/submissions/${submissionId}`, {
        method: 'DELETE',
      });
    } catch {
      // Fallback local mutation
    }

    const currentAssignments = getLocalAssignments();
    const updated = currentAssignments.map((a) => {
      if (a.id === assignmentId) {
        return {
          ...a,
          submissions: (a.submissions || []).filter((s) => s.id !== submissionId),
          submissionCount: Math.max(0, (a.submissionCount || 1) - 1),
        };
      }
      return a;
    });
    setLocalAssignments(updated);

    return { success: true, message: 'Đã hủy nộp bài tập!' };
  },
};
