import { serverApiClient } from '@/lib/api/server-api-client';
import type { QuizAttemptResult, QuizClassStats } from '@/types/quiz';

export const quizAttemptsServerService = {
  // Fetches a single quiz attempt result by ID during SSR
  async getAttemptById(attemptId: string): Promise<QuizAttemptResult | null> {
    try {
      const res = await serverApiClient<QuizAttemptResult>(`/quiz-attempts/${attemptId}`, {
        ignoreAuthError: true,
      });
      if (res && res.success !== false && res.data) {
        return res.data;
      }
    } catch {
      return null;
    }
    return null;
  },

  // Fetches classroom quiz statistics by publication ID during SSR
  async getClassQuizStats(publicationId: string): Promise<QuizClassStats | null> {
    try {
      const res = await serverApiClient<QuizClassStats>(
        `/quiz-publications/${publicationId}/stats`,
        {
          ignoreAuthError: true,
        },
      );
      if (res && res.success !== false && res.data) {
        return res.data;
      }
    } catch {
      return null;
    }
    return null;
  },
};
