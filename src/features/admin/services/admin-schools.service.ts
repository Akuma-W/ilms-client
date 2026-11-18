import { clientApiClient } from '@/lib/api/client-api-client';
import type { PaginatedResult } from '@/types/api';
import type {
  AdminActionResult,
  AdminSchool,
  AdminSubject,
  CreateAdminSchoolInput,
  UpdateAdminSchoolInput,
} from '@/types/admin';

export const adminSchoolService = {
  // Retrieves paginated schools list with active and search filters
  async getSchools(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive';
  }): Promise<PaginatedResult<AdminSchool>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);

    const endpoint = `/admin/schools${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await clientApiClient<PaginatedResult<AdminSchool>>(endpoint);
    return res?.data || { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1 } };
  },

  // Retrieves school details by unique identifier
  async getSchool(id: string): Promise<AdminSchool | null> {
    const res = await clientApiClient<AdminSchool>(`/admin/schools/${id}`);
    return res?.data || null;
  },

  // Creates a new institutional school record
  async createSchool(input: CreateAdminSchoolInput): Promise<AdminSchool> {
    const res = await clientApiClient<AdminSchool>('/admin/schools', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể tạo trường học mới');
    }
    return res.data;
  },

  // Updates existing school attributes
  async updateSchool(id: string, input: UpdateAdminSchoolInput): Promise<AdminSchool> {
    const res = await clientApiClient<AdminSchool>(`/admin/schools/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể cập nhật thông tin trường');
    }
    return res.data;
  },

  // Deletes an institutional school if no classes or subjects exist
  async deleteSchool(id: string): Promise<AdminActionResult> {
    const res = await clientApiClient<AdminActionResult>(`/admin/schools/${id}`, {
      method: 'DELETE',
    });
    return {
      success: res.success,
      message: res.message || 'Xóa trường học thành công',
    };
  },

  // Fetches curriculum subjects belonging to school
  async getSchoolSubjects(schoolId: string): Promise<AdminSubject[]> {
    const res = await clientApiClient<{ data: AdminSubject[] } | AdminSubject[]>(
      `/subjects?schoolId=${schoolId}&limit=100`,
    );
    if (!res?.data) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray((res.data as { data?: AdminSubject[] }).data)) {
      return (res.data as { data: AdminSubject[] }).data;
    }
    return [];
  },
};
