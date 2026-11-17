import { clientApiClient } from '@/lib/api/client-api-client';
import type {
  CheckedAnswerResult,
  QuizAttempt,
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

  // Checks a single question answer in immediate review mode
  async checkAnswer(
    attemptId: string,
    questionId: string,
    selectedOptionIds: string[],
  ): Promise<CheckedAnswerResult> {
    const res = await clientApiClient<CheckedAnswerResult>(
      `/quiz-attempts/${attemptId}/check-answer`,
      {
        method: 'POST',
        body: JSON.stringify({ questionId, selectedOptionIds }),
      },
    );
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể kiểm tra câu trả lời');
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

  // Retrieves user previous attempts for a quiz
  async getUserAttempts(quizId: string, publicationId?: string): Promise<QuizAttempt[]> {
    const query = publicationId ? `?publicationId=${publicationId}` : '';
    const res = await clientApiClient<QuizAttempt[]>(`/quizzes/${quizId}/my-attempts${query}`);
    if (res && res.success !== false && res.data) {
      return res.data;
    }
    return [];
  },

  // Retrieves class-wide aggregated quiz score statistics
  async getClassQuizStats(publicationId: string): Promise<QuizClassStats> {
    const res = await clientApiClient<QuizClassStats>(`/quiz-publications/${publicationId}/stats`);
    if (res && res.success !== false && res.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Không thể tải thống kê bài thi');
  },
};
