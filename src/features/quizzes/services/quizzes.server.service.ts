import { serverApiClient } from '@/lib/api/server-api-client';
import { getMockClassQuizzes } from '@/mocks/classes/mock-quizzes';
import type { QuizClassItem } from '@/types/quiz';

/**
 * Server-side service for Class Quizzes SSR.
 * Encapsulates serverApiClient and fallback to mock data when API errors or fails.
 */
export const quizzesServerService = {
  /**
   * SSR fetcher for quizzes published to a class.
   */
  async getClassQuizzes(classId: string): Promise<QuizClassItem[]> {
    try {
      const res = await serverApiClient<QuizClassItem[]>(`/classes/${classId}/quizzes`, {
        ignoreAuthError: true,
      });
      if (res && res.success !== false && Array.isArray(res.data)) {
        return res.data;
      }
      return getMockClassQuizzes(classId);
    } catch {
      return getMockClassQuizzes(classId);
    }
  },
};
