import { clientApiClient } from '@/lib/api/client-api-client';
import type {
  CreateQuizInput,
  PaginatedQuizzesResult,
  QueryQuizInput,
  Quiz,
  UpdateQuizInput,
} from '@/types/quiz';

export const quizzesService = {
  // Retrieves paginated list of quizzes (public community library or user own quizzes)
  async getQuizzes(query?: QueryQuizInput): Promise<PaginatedQuizzesResult<Quiz>> {
    const params = new URLSearchParams();
    if (query?.scope) params.append('scope', query.scope);
    if (query?.search) params.append('search', query.search);
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));

    const endpoint = `/quizzes${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await clientApiClient<PaginatedQuizzesResult<Quiz>>(endpoint);
    if (res?.success !== false && res?.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Không thể tải danh sách đề thi');
  },

  // Retrieves single quiz details along with its questions and options
  async getQuizById(id: string): Promise<Quiz | null> {
    const res = await clientApiClient<Quiz>(`/quizzes/${id}`);
    if (res && res.success !== false && res.data) {
      return res.data;
    }
    return null;
  },

  // Creates a new quiz draft in user repository
  async createQuiz(input: CreateQuizInput): Promise<Quiz> {
    const res = await clientApiClient<Quiz>('/quizzes', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể tạo đề thi mới');
    }
    return res.data;
  },

  // Updates quiz metadata such as title, timeLimit, visibility, status
  async updateQuiz(id: string, input: UpdateQuizInput): Promise<Quiz> {
    const res = await clientApiClient<Quiz>(`/quizzes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể cập nhật đề thi');
    }
    return res.data;
  },

  // Deletes a quiz from user repository
  async deleteQuiz(id: string): Promise<{ success: boolean; message: string }> {
    const res = await clientApiClient<unknown>(`/quizzes/${id}`, {
      method: 'DELETE',
    });
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể xóa đề thi');
    }
    return {
      success: true,
      message: res.message || 'Xóa đề thi thành công',
    };
  },

  // Clones a public quiz into personal library
  async cloneQuiz(id: string): Promise<Quiz> {
    const res = await clientApiClient<Quiz>(`/quizzes/${id}/clone`, {
      method: 'POST',
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể sao chép đề thi');
    }
    return res.data;
  },

  // Retrieves available quizzes for teacher to publish into a class
  async getAvailableQuizzes(): Promise<Quiz[]> {
    const res = await this.getQuizzes({ scope: 'my', limit: 50 });
    return res.items || [];
  },
};
