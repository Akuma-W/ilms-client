import { clientApiClient } from '@/lib/api/client-api-client';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';
import type { Class } from '@/types/class';

export const userService = {
  async getMe(): Promise<User | null> {
    const result = await clientApiClient<User>('/users/me');
    return result.data;
  },

  async getUser(id: string): Promise<User | null> {
    const result = await clientApiClient<User>(`/users/${id}`);
    return result.data;
  },

  async getProfileClasses(): Promise<ApiResponse<Class[]>> {
    return clientApiClient<Class[]>('/users/me/classes');
  },

  async updateProfile(data: {
    fullName?: string;
    identityCode?: string;
  }): Promise<ApiResponse<User>> {
    return clientApiClient<User>('/users/me/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async updateAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return clientApiClient<{ avatarUrl: string }>('/users/me/avatar', {
      method: 'PATCH',
      body: formData,
    });
  },
};
