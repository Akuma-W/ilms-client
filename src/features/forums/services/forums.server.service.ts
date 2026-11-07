import { serverApiClient } from '@/lib/api/server-api-client';
import { getMockForumById, getMockForums } from '@/mocks/classes/mock-forums';
import type { Forum } from '@/types/forum';

/**
 * Server-side forums service for Server Components (SSR).
 * Encapsulates serverApiClient and fallback to mock data when API errors or fails.
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
      if (res && res.success !== false && Array.isArray(res.data)) {
        return res.data;
      }
      return getMockForums(classId);
    } catch {
      return getMockForums(classId);
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
      return getMockForumById(forumId);
    } catch {
      return getMockForumById(forumId);
    }
  },
};
