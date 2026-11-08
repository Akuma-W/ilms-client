import { clientApiClient } from '@/lib/api/client-api-client';
import { MOCK_ENROLLMENT } from '@/mocks/classes/class-data.mock';
import type { QueryResponse } from '@/types/api';
import type { Class } from '@/types/class';
import type { Enrollment } from '@/types/enrollment';
import type { EnrollmentStatus } from '@/types/enum';

/**
 * Client-side enrollment service for Browser Components (CSR, SWR, Star, Join).
 * Encapsulates try/catch and fallback to mock data when API errors or fails.
 */
export const enrollmentService = {
  async joinClass(
    payload: { classId: string; roleIn?: string; isStarred?: boolean } | string,
  ): Promise<Enrollment | null> {
    try {
      const body = typeof payload === 'string' ? { classId: payload } : payload;
      const result = await clientApiClient<Enrollment>('/enrollments/join', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async getMyRelationInClass(classId: string): Promise<Enrollment | null> {
    try {
      const result = await clientApiClient<Enrollment>(`/enrollments/me/${classId}`);
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback
    }
    return { ...MOCK_ENROLLMENT, classId };
  },

  async getStarredClasses() {
    try {
      const result = await clientApiClient<{
        classes: Class[];
        total: number;
      }>('/enrollments/me/star');
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
  }) {
    try {
      const query = new URLSearchParams();
      if (params.status) query.set('status', params.status);
      if (params.isStarred !== undefined) query.set('isStarred', String(params.isStarred));
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));
      if (params.search) query.set('search', params.search);

      const url = query.toString() ? `/enrollments/me?${query.toString()}` : '/enrollments/me';
      const result = await clientApiClient<QueryResponse<Class>>(url);
      if (result.success !== false && result.data !== null && result.data !== undefined) {
        return result.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async toggleStar(enrollmentId: string) {
    try {
      const result = await clientApiClient(`/enrollments/${enrollmentId}/star`, {
        method: 'PATCH',
      });
      return result.success;
    } catch {
      return true;
    }
  },

  async leaveClass(classId: string) {
    try {
      const result = await clientApiClient<{ message: string }>(`/enrollments/${classId}/leave`, {
        method: 'DELETE',
      });
      return result;
    } catch {
      // Fallback
    }
    return { success: false, message: 'Rời lớp học thất bại', data: null, statusCode: 500 };
  },
};
