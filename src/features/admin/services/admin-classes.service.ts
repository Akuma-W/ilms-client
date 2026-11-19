import { clientApiClient } from '@/lib/api/client-api-client';
import type { PaginatedResult } from '@/types/api';
import type {
  AdminActionResult,
  AdminClass,
  AdminSubject,
  CreateAdminClassInput,
  UpdateAdminClassInput,
} from '@/types/admin';

export const adminClassesService = {
  // Retrieves all platform classrooms with multi-criteria filtering
  async getClasses(params?: {
    page?: number;
    limit?: number;
    search?: string;
    schoolId?: string;
    subjectId?: string;
    isArchived?: boolean;
  }): Promise<PaginatedResult<AdminClass>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search?.trim()) query.set('search', params.search.trim());
    if (params?.schoolId && params.schoolId !== 'all' && params.schoolId.trim() !== '') {
      query.set('schoolId', params.schoolId.trim());
    }
    if (params?.subjectId && params.subjectId !== 'all' && params.subjectId.trim() !== '') {
      query.set('subjectId', params.subjectId.trim());
    }
    if (params?.isArchived !== undefined) query.set('isArchived', String(params.isArchived));

    const endpoint = `/admin/classes${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await clientApiClient<PaginatedResult<AdminClass>>(endpoint);
    return res?.data || { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1 } };
  },

  // Retrieves specific class details
  async getClass(id: string): Promise<AdminClass | null> {
    const res = await clientApiClient<AdminClass>(`/admin/classes/${id}`);
    return res?.data || null;
  },

  // Creates classroom directly as administrator
  async createClass(input: CreateAdminClassInput): Promise<AdminClass> {
    const res = await clientApiClient<AdminClass>('/admin/classes', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể tạo lớp học mới');
    }
    return res.data;
  },

  // Updates existing classroom attributes as administrator
  async updateClass(id: string, input: UpdateAdminClassInput): Promise<AdminClass> {
    const res = await clientApiClient<AdminClass>(`/admin/classes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể cập nhật lớp học');
    }
    return (res.data as AdminClass) || ({} as AdminClass);
  },

  // Toggles archived state for classroom with bidirectional support
  async toggleArchiveClass(id: string, currentlyArchived: boolean): Promise<AdminClass> {
    const endpoint = currentlyArchived
      ? `/admin/classes/${id}/unarchive`
      : `/admin/classes/${id}/archive`;
    const res = await clientApiClient<AdminClass>(endpoint, {
      method: 'PATCH',
    });
    if (!res || res.success === false) {
      throw new Error(res?.message || 'Không thể thay đổi trạng thái lưu trữ');
    }
    return (res.data as AdminClass) || ({} as AdminClass);
  },

  // Force deletes class if eligible
  async deleteClass(id: string): Promise<AdminActionResult> {
    const res = await clientApiClient<AdminActionResult>(`/admin/classes/${id}`, {
      method: 'DELETE',
    });
    return {
      success: res.success,
      message: res.message || 'Xóa lớp học thành công',
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
