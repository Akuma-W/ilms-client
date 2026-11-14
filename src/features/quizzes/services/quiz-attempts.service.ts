import { clientApiClient } from '@/lib/api/client-api-client';
import type {
  QuizAttemptResult,
  QuizAttemptSession,
  QuizClassStats,
  SubmitQuizAnswer,
} from '@/types/quiz';

export const quizAttemptsService = {
  // Starts a quiz attempt with answers masked by the server
  async startAttempt(quizId: string, publicationId?: string): Promise<QuizAttemptSession> {
    const res = await clientApiClient<QuizAttemptSession>(`/quizzes/${quizId}/attempts`, {
      method: 'POST',
      body: JSON.stringify(publicationId ? { publicationId } : {}),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể bắt đầu làm bài thi');
    }
    return res.data;
  },

  // Submits answers for grading by attempt ID
  async submitAttempt(attemptId: string, answers: SubmitQuizAnswer[]): Promise<QuizAttemptResult> {
    const res = await clientApiClient<QuizAttemptResult>(`/quiz-attempts/${attemptId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể nộp bài thi');
    }
    return res.data;
  },

  // Retrieves detailed attempt result with question-by-question review
  async getAttemptById(attemptId: string): Promise<QuizAttemptResult> {
    const res = await clientApiClient<QuizAttemptResult>(`/quiz-attempts/${attemptId}`);
    if (res && res.success !== false && res.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Không thể tải kết quả bài thi');
  },

  // Retrieves class-wide aggregated quiz score statistics (for QuizClassStatsModal)
  async getClassQuizStats(publicationId: string): Promise<QuizClassStats> {
    const res = await clientApiClient<QuizClassStats>(`/quiz-publications/${publicationId}/stats`);
    if (res && res.success !== false && res.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Không thể tải thống kê bài thi');
  },
};
