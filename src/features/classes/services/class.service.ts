import { apiClient } from '@/lib/api/api-client';
import { QueryResponse } from '@/types/api';
import { Class } from '@/types/class';

export const classService = {
  async getClasses(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<QueryResponse<Class>> {
    const query = new URLSearchParams();

    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);

    const url = query.toString() ? `/classes?${query.toString()}` : '/classes';
    const result = await apiClient<QueryResponse<Class>>(url);

    if (!result.data) {
      throw new Error('Data is invalid');
    }

    return result.data;
  },

  async getMyCreatedClasses(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<QueryResponse<Class>> {
    const query = new URLSearchParams();

    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);

    const url = query.toString()
      ? `/classes/me/created?${query.toString()}`
      : '/classes/me/created';
    const result = await apiClient<QueryResponse<Class>>(url);

    if (!result.data) {
      throw new Error('Data is invalid');
    }

    return result.data;
  },
};
