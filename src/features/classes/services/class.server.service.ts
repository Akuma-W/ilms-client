import { serverApiClient } from '@/lib/api/server-api-client';
import type { QueryResponse } from '@/types/api';
import type { Class } from '@/types/class';

/**
 * Server-side classes service for Server Components (SSR).
 */
export const classServerService = {
  async getClassData(id: string): Promise<Class | null> {
    const result = await serverApiClient<Class>(`/classes/${id}`, {
      ignoreAuthError: true,
    });
    return result.data;
  },

  async getClasses(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<QueryResponse<Class> | null> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);

    const url = query.toString() ? `/classes?${query.toString()}` : '/classes';
    const result = await serverApiClient<QueryResponse<Class>>(url, {
      ignoreAuthError: true,
    });
    return result.data;
  },

  async getMyCreatedClasses(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<QueryResponse<Class> | null> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);

    const url = query.toString()
      ? `/classes/me/created?${query.toString()}`
      : '/classes/me/created';
    const result = await serverApiClient<QueryResponse<Class>>(url, {
      ignoreAuthError: true,
    });
    return result.data;
  },
};
