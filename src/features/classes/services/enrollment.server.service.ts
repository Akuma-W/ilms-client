import { serverApiClient } from '@/lib/api/server-api-client';
import { MOCK_ENROLLMENT } from '@/mocks/classes/class-data.mock';
import type { QueryResponse } from '@/types/api';
import type { Class } from '@/types/class';
import type { Enrollment } from '@/types/enrollment';
import type { EnrollmentStatus } from '@/types/enum';

/**
 * Server-side enrollment service executing in Node.js runtime (SSR).
 * Encapsulates try/catch and fallback to mock data when API errors or fails.
 */
export const enrollmentServerService = {
  async getMyRelationInClass(classId: string): Promise<Enrollment | null> {
    try {
      const result = await serverApiClient<Enrollment>(`/enrollments/me/${classId}`, {
        ignoreAuthError: true,
      });
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback
    }
    return { ...MOCK_ENROLLMENT, classId };
  },

  async getStarredClasses(): Promise<{
    classes: Class[];
    total: number;
  }> {
    try {
      const result = await serverApiClient<{
        classes: Class[];
        total: number;
      }>('/enrollments/me/star', {
        ignoreAuthError: true,
      });
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback
    }
    return {
      classes: [],
      total: 0,
    };
  },

  async getMyEnrollments(params: {
    status?: EnrollmentStatus;
    isStarred?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<QueryResponse<Class> | null> {
    try {
      const query = new URLSearchParams();
      if (params.status) query.set('status', params.status);
      if (params.isStarred !== undefined) query.set('isStarred', String(params.isStarred));
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));
      if (params.search) query.set('search', params.search);

      const url = query.toString() ? `/enrollments/me?${query.toString()}` : '/enrollments/me';
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
