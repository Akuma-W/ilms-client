import { apiClient } from '@/lib/api/api-client';
import { User } from '@/types/user';

export const userService = {
  async getMe() {
    const result = await apiClient<User>('/users/me', {
      ignoreAuthError: true,
    });

    return result.data;
  },
  async getUser(id: string) {
    const result = await apiClient<User>(`/users/${id}`);

    return result.data;
  },
};
