import { clientApiClient } from '@/lib/api/client-api-client';
import { QueryResponse } from '@/types/api';
import { Class } from '@/types/class';
import { Enrollment, JoinClassResponse } from '@/types/enrollment';
import { EnrollmentStatus } from '@/types/enum';

/**
 * Client-side enrollment service for Browser Components (CSR, SWR, Star, Join).
 */
export const enrollmentService = {
  async joinClass(payload: EnrollmentStatus) {
    const result = await clientApiClient<JoinClassResponse>('/enrollments/join', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return result.data;
  },

  async getMyRelationInClass(classId: string) {
    const result = await clientApiClient<Enrollment>(`/enrollments/me/${classId}`);
    return result.data;
  },

  async getStarredClasses() {
    const result = await clientApiClient<{
      classes: Class[];
      total: number;
    }>('/enrollments/me/star');

    if (!result.data) {
      return {
        classes: [],
        total: 0,
      };
    }

    return result.data;
  },

  async getMyEnrollments(params: {
    status?: EnrollmentStatus;
    isStarred?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const query = new URLSearchParams();

    if (params.status) query.set('status', params.status);
    if (params.isStarred !== undefined) query.set('isStarred', String(params.isStarred));
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);

    const url = query.toString() ? `/enrollments/me?${query.toString()}` : '/enrollments/me';
    const result = await clientApiClient<QueryResponse<Class>>(url);

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  },

  async toggleStar(enrollmentId: string) {
    const result = await clientApiClient(`/enrollments/${enrollmentId}/star`, {
      method: 'PATCH',
    });

    return result.success;
  },
};
