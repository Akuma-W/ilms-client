import { clientApiClient } from '@/lib/api/client-api-client';
import { getMockClass } from '@/mocks/classes/class-data.mock';
import type { QueryResponse } from '@/types/api';
import type { Class, ClassClient, CreateClassPayload } from '@/types/class';

/**
 * Client-side class service for Browser Components (CSR, SWR, Modals).
 * Encapsulates try/catch and fallback to mock data when API errors or fails.
 */
export const classService = {
  async createClass(payload: CreateClassPayload) {
    try {
      const result = await clientApiClient<Class>('/classes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async getClasses(params: { page?: number; limit?: number; search?: string }) {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));
      if (params.search) query.set('search', params.search);

      const url = query.toString() ? `/classes?${query.toString()}` : '/classes';
      const result = await clientApiClient<QueryResponse<Class>>(url);
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async getMyCreatedClasses(params: { page?: number; limit?: number; search?: string }) {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));
      if (params.search) query.set('search', params.search);

      const url = query.toString()
        ? `/classes/me/created?${query.toString()}`
        : '/classes/me/created';
      const result = await clientApiClient<QueryResponse<Class>>(url);
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async getClassByCourseCode(courseCode: string) {
    try {
      const result = await clientApiClient<Class>(`/classes/code/${courseCode}`);
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result;
      }
    } catch {
      // Fallback
    }
    return { success: false, data: null, statusCode: 404, message: 'Không tìm thấy lớp học' };
  },

  async getClassData(id: string): Promise<Class | ClassClient> {
    try {
      const result = await clientApiClient<Class>(`/classes/${id}`);
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback to mock on connection or runtime error
    }
    return getMockClass(id);
  },
};
