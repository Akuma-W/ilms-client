import { clientApiClient } from '@/lib/api/client-api-client';
import type { PaginatedResult } from '@/types/api';
import type { AdminActionResult, AdminQuiz } from '@/types/admin';

export const adminQuizzesService = {
  // Retrieves paginated list of quizzes across platform
  async getQuizzes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    visibility?: string;
    status?: string;
    creatorId?: string;
  }): Promise<PaginatedResult<AdminQuiz>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.visibility) query.set('visibility', params.visibility);
    if (params?.status) query.set('status', params.status);
    if (params?.creatorId) query.set('creatorId', params.creatorId);

    const endpoint = `/admin/quizzes${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await clientApiClient<PaginatedResult<AdminQuiz>>(endpoint);
    return res?.data || { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1 } };
  },

  // Retrieves unmasked examination questions and answers for audit
  async getQuizDetail(id: string): Promise<AdminQuiz | null> {
    const res = await clientApiClient<AdminQuiz>(`/admin/quizzes/${id}`);
    return res?.data || null;
  },

  // Takes down public quiz to draft due to copyright violation
  async takedownQuiz(id: string, reason: string): Promise<AdminQuiz> {
    const res = await clientApiClient<AdminQuiz>(`/admin/quizzes/${id}/takedown`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể gỡ bản quyền đề thi');
    }
    return res.data;
  },

  // Force deletes quiz examination
  async forceDeleteQuiz(id: string): Promise<AdminActionResult> {
    const res = await clientApiClient<AdminActionResult>(`/admin/quizzes/${id}`, {
      method: 'DELETE',
    });
    return {
      success: res.success,
      message: res.message || 'Xóa đề thi vĩnh viễn thành công',
    };
  },
};
