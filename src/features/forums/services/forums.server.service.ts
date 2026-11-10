import { serverApiClient } from '@/lib/api/server-api-client';
import type { Forum } from '@/types/forum';

/**
 * Server-side forums service for Server Components (SSR).
 * Connects directly to backend REST API under /api/v1/ with HttpOnly Cookie forwarding.
 */
export const forumsServerService = {
  /**
   * SSR data fetcher for class forums list.
   */
  async getForums(classId: string): Promise<Forum[]> {
    try {
      const res = await serverApiClient<Forum[]>(`/classes/${classId}/forums`, {
        ignoreAuthError: true,
      });
      if (res && res.success !== false) {
        if (Array.isArray(res.data)) {
          return res.data;
        }
        if (res.data && typeof res.data === 'object') {
          return Object.values(res.data) as Forum[];
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * SSR data fetcher for single forum topic and comments.
   */
  async getForumDetail(forumId: string): Promise<Forum | null> {
    try {
      const res = await serverApiClient<Forum>(`/forums/${forumId}`, {
        ignoreAuthError: true,
      });
      if (res && res.success !== false && res.data) {
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },
};
