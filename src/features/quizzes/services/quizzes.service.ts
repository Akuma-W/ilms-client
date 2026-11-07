import { clientApiClient } from '@/lib/api/client-api-client';
import {
  getAllMockQuizzes,
  getMockClassQuizzes,
  getMockQuizClassStats,
  publishMockQuizToClass,
  unpublishMockQuizFromClass,
} from '@/mocks/classes/mock-quizzes';
import type { PublishQuizInput, Quiz, QuizClassItem, QuizClassStats } from '@/types/quiz';

/**
 * Client-side quizzes service for Browser Components (CSR, SWR, Mutations).
 * Encapsulates clientApiClient and fallback to mock data when API errors or fails.
 */
export const quizzesService = {
  /**
   * Retrieves list of quizzes published in the specified class.
   */
  async getClassQuizzes(classId: string): Promise<QuizClassItem[]> {
    try {
      const res = await clientApiClient<QuizClassItem[]>(`/classes/${classId}/quizzes`);
      if (res && res.success !== false && Array.isArray(res.data)) {
        return res.data;
      }
      return getMockClassQuizzes(classId);
    } catch {
      return getMockClassQuizzes(classId);
    }
  },

  /**
   * Retrieves teacher's personal quizzes repository to choose from for publishing.
   */
  async getAvailableQuizzes(): Promise<Quiz[]> {
    try {
      const res = await clientApiClient<Quiz[]>('/quizzes', { ignoreAuthError: true });
      if (res && res.success !== false && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return getAllMockQuizzes();
    } catch {
      return getAllMockQuizzes();
    }
  },

  /**
   * Publishes an existing quiz from teacher's repository into the class.
   */
  async publishQuiz(
    classId: string,
    input: PublishQuizInput,
    topicName?: string,
  ): Promise<{ success: boolean; data: QuizClassItem; message: string }> {
    try {
      const res = await clientApiClient<QuizClassItem>(`/classes/${classId}/quizzes/publish`, {
        method: 'POST',
        body: JSON.stringify(input),
        ignoreAuthError: true,
      });
      if (res && res.success !== false && res.data) {
        return {
          success: true,
          data: res.data,
          message: 'Xuất bản bài trắc nghiệm vào lớp thành công!',
        };
      }
    } catch {
      // Fallback to in-memory mock
    }

    const mockItem = publishMockQuizToClass(classId, input, topicName);
    return {
      success: true,
      data: mockItem,
      message: 'Xuất bản bài trắc nghiệm vào lớp thành công!',
    };
  },

  /**
   * Unpublishes (removes) a quiz from the class without deleting the original quiz.
   */
  async unpublishQuiz(
    classId: string,
    quizId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const res = await clientApiClient<unknown>(
        `/classes/${classId}/quizzes/${quizId}/unpublish`,
        {
          method: 'DELETE',
        },
      );
      if (res && res.success !== false) {
        return { success: true, message: 'Đã gỡ bài trắc nghiệm khỏi lớp học.' };
      }
    } catch {
      // Fallback to mock
    }

    unpublishMockQuizFromClass(classId, quizId);
    return { success: true, message: 'Đã gỡ bài trắc nghiệm khỏi lớp học.' };
  },

  /**
   * Retrieves class evaluation statistics for a specific quiz (submitted vs unsubmitted, class average).
   */
  async getClassQuizStats(classId: string, quizId: string): Promise<QuizClassStats> {
    try {
      const res = await clientApiClient<QuizClassStats>(
        `/classes/${classId}/quizzes/${quizId}/stats`,
      );
      if (res && res.success !== false && res.data) {
        return res.data;
      }
      return getMockQuizClassStats(quizId);
    } catch {
      return getMockQuizClassStats(quizId);
    }
  },
};
