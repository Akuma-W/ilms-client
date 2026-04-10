import { apiClient } from '@/lib/api/api-client';
import { QueryResponse } from '@/types/api';
import { Class } from '@/types/class';
import { EnrollmentStatus } from '@/types/enum';

export const enrollmentService = {
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
    const result = await apiClient<QueryResponse<Class>>(url);

    if (!result.success || !result.data) {
      return null;
    }

    return result.data;
  },
};
