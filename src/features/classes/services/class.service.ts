import { apiClient } from '@/lib/api/api-client';
import { QueryResponse } from '@/types/api';
import { Class, CreateClassPayload } from '@/types/class';

export const classService = {
  async createClass(payload: CreateClassPayload) {
    const result = await apiClient<Class>('/classes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return result.data;
  },

  async getClasses(params: { page?: number; limit?: number; search?: string }) {
    const query = new URLSearchParams();

    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);

    const url = query.toString() ? `/classes?${query.toString()}` : '/classes';
    const result = await apiClient<QueryResponse<Class>>(url);

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  },

  async getMyCreatedClasses(params: { page?: number; limit?: number; search?: string }) {
    const query = new URLSearchParams();

    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);

    const url = query.toString()
      ? `/classes/me/created?${query.toString()}`
      : '/classes/me/created';
    const result = await apiClient<QueryResponse<Class>>(url);

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  },

  async getClassByCourseCode(courseCode: string) {
    const result = await apiClient<Class>(`/classes/code/${courseCode}`);

    return result;
  },

  async getClassData(id: string) {
    const result = await apiClient<Class>(`/classes/${id}`);

    return result.data;
  },
};
