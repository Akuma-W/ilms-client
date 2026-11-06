import { serverApiClient } from '@/lib/api/server-api-client';
import { User } from '@/types/user';

/**
 * Server-side user service executing in Node.js runtime (SSR / Server Components).
 */
export const userServerService = {
  async getMe(): Promise<User | null> {
    const result = await serverApiClient<User>('/users/me', {
      ignoreAuthError: true,
    });
    return result.data;
  },

  async getUser(id: string): Promise<User | null> {
    const result = await serverApiClient<User>(`/users/${id}`);
    return result.data;
  },
};
