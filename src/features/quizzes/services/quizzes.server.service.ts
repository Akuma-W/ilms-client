import { serverApiClient } from '@/lib/api/server-api-client';
import type { PaginatedQuizzesResult, QueryQuizInput, Quiz } from '@/types/quiz';

export const quizzesServerService = {
  // Loads an initial page of quizzes for server-rendered repository content
  async getQuizzes(query: QueryQuizInput): Promise<PaginatedQuizzesResult<Quiz> | null> {
    const params = new URLSearchParams();
    if (query.scope) params.set('scope', query.scope);
    if (query.search) params.set('search', query.search);
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));

    try {
      const res = await serverApiClient<PaginatedQuizzesResult<Quiz>>(
        `/quizzes?${params.toString()}`,
      );
      return res && res.success !== false ? res.data : null;
    } catch {
      return null;
    }
  },

  // Loads a quiz blueprint for detail and edit routes
  async getQuizById(id: string): Promise<Quiz | null> {
    try {
      const res = await serverApiClient<Quiz>(`/quizzes/${id}`);
      return res && res.success !== false ? res.data : null;
    } catch {
      return null;
    }
  },
};
