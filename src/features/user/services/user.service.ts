import { clientApiClient } from '@/lib/api/client-api-client';
import { User } from '@/types/user';

/**
 * Client-side user service for Browser Components and hooks (e.g. useCurrentUser).
 */
export const userService = {
  async getMe(): Promise<User | null> {
    const result = await clientApiClient<User>('/users/me', {
      ignoreAuthError: true,
      skipAutoRefresh: true,
    });
    return result.data;
  },

  async getUser(id: string): Promise<User | null> {
    const result = await clientApiClient<User>(`/users/${id}`);
    return result.data;
  },
};
