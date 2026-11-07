import { serverApiClient } from '@/lib/api/server-api-client';
import { getMockClass } from '@/mocks/classes/class-data.mock';
import type { QueryResponse } from '@/types/api';
import type { Class, ClassClient } from '@/types/class';

/**
 * Server-side classes service for Server Components (SSR).
 * Encapsulates try/catch and fallback to mock data when API errors or fails.
 */
export const classServerService = {
  async getClassData(id: string): Promise<Class | ClassClient> {
    try {
      const result = await serverApiClient<Class>(`/classes/${id}`, {
        ignoreAuthError: true,
      });
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback to mock on connection or runtime error
    }
    return getMockClass(id);
  },

  async getClasses(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<QueryResponse<Class> | null> {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));
      if (params.search) query.set('search', params.search);

      const url = query.toString() ? `/classes?${query.toString()}` : '/classes';
      const result = await serverApiClient<QueryResponse<Class>>(url, {
        ignoreAuthError: true,
      });
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async getMyCreatedClasses(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<QueryResponse<Class> | null> {
    try {
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
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },
};
