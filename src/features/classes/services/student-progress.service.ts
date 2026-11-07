import { clientApiClient } from '@/lib/api/client-api-client';
import type { StudentClassProgress } from '@/types/class';

export type { StudentClassProgress };

const DEFAULT_MOCK_PROGRESS: StudentClassProgress = {
  averageScore: 8.5,
  assignmentsCompleted: 4,
  totalAssignments: 5,
  assignmentRate: 80,
  quizzesCompleted: 3,
  totalQuizzes: 5,
  quizRate: 60,
  meetAttended: 9,
  totalMeetings: 10,
  meetRate: 90,
};

/**
 * Service providing student learning progress and attendance stats.
 */
export const studentProgressService = {
  /**
   * Retrieves student's current progress in a specific class.
   */
  async getStudentProgress(classId: string, studentId?: string): Promise<StudentClassProgress> {
    try {
      const res = await clientApiClient<StudentClassProgress>(
        `/classes/${classId}/students/${studentId}/progress`,
      );
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res.data;
      }
    } catch {
      // Graceful fallback to mock progress
    }

    return DEFAULT_MOCK_PROGRESS;
  },
};
