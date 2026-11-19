import { clientApiClient } from '@/lib/api/client-api-client';
import type { PaginatedResult } from '@/types/api';
import type {
  AdminActionResult,
  AdminResetPasswordResult,
  AdminUser,
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from '@/types/admin';

export const adminUsersService = {
  // Retrieves all user accounts with pagination and filtering
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    schoolId?: string;
  }): Promise<PaginatedResult<AdminUser>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search?.trim()) query.set('search', params.search.trim());
    if (params?.role && params.role !== 'all' && params.role.trim() !== '') {
      query.set('role', params.role.trim());
    }
    if (params?.status && params.status !== 'all' && params.status.trim() !== '') {
      query.set('status', params.status.trim());
    }
    if (params?.schoolId && params.schoolId !== 'all' && params.schoolId.trim() !== '') {
      query.set('schoolId', params.schoolId.trim());
    }

    const endpoint = `/admin/users${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await clientApiClient<PaginatedResult<AdminUser>>(endpoint);
    return res?.data || { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1 } };
  },

  // Retrieves specific user details
  async getUser(id: string): Promise<AdminUser | null> {
    const res = await clientApiClient<AdminUser>(`/admin/users/${id}`);
    return res?.data || null;
  },

  // Creates user account directly by administrator
  async createUser(input: CreateAdminUserInput): Promise<AdminUser> {
    const res = await clientApiClient<AdminUser>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể tạo tài khoản người dùng');
    }
    return res.data;
  },

  // Updates profile details and lifecycle status
  async updateUser(id: string, input: UpdateAdminUserInput): Promise<AdminUser> {
    const res = await clientApiClient<AdminUser>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể cập nhật tài khoản');
    }
    return res.data;
  },

  // Resets user password
  async resetPassword(
    id: string,
    input?: { newPassword?: string },
  ): Promise<AdminResetPasswordResult> {
    const res = await clientApiClient<AdminResetPasswordResult>(
      `/admin/users/${id}/reset-password`,
      {
        method: 'POST',
        body: JSON.stringify(input || {}),
      },
    );
    if (!res || res.success === false || !res.data) {
      throw new Error(res?.message || 'Không thể đặt lại mật khẩu');
    }
    return res.data;
  },

  // Deletes or deactivates user account
  async deleteUser(id: string): Promise<AdminActionResult> {
    const res = await clientApiClient<AdminActionResult>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
    return {
      success: res.success,
      message: res.message || 'Xóa tài khoản thành công',
    };
  },
};
