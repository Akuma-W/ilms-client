import { apiClient } from '@/lib/api/api-client';
import { User } from '@/types/user';

export const userService = {
  async getMe() {
    const result = await apiClient<User>('/users/me');

    return result.data;
  },
};
