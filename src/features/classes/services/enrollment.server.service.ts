import { serverApiClient } from '@/lib/api/server-api-client';
import type { QueryResponse } from '@/types/api';
import type { Class } from '@/types/class';
import type { Enrollment } from '@/types/enrollment';
import type { EnrollmentStatus } from '@/types/enum';

/**
 * Server-side enrollment service executing in Node.js runtime (SSR).
 */
export const enrollmentServerService = {
  async getMyRelationInClass(classId: string): Promise<Enrollment | null> {
    const result = await serverApiClient<Enrollment>(`/enrollments/me/${classId}`, {
      ignoreAuthError: true,
    });
    return result.data;
  },

  async getStarredClasses(): Promise<{
    classes: Class[];
    total: number;
  }> {
    const result = await serverApiClient<{
      classes: Class[];
      total: number;
    }>('/enrollments/me/star', {
      ignoreAuthError: true,
    });

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
  }): Promise<QueryResponse<Class> | null> {
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
    return result.data;
  },
};
