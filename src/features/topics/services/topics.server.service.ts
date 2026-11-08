import { serverApiClient } from '@/lib/api/server-api-client';
import { getMockTopics } from '@/mocks/classes/class-data.mock';
import type { Topic } from '@/types/topic';

/**
 * Server-side topics service for Server Components (SSR).
 * Reads HttpOnly cookies via next/headers and forwards them to the NestJS backend.
 */
export const topicsServerService = {
  async getTopics(classId: string): Promise<Topic[]> {
    try {
      const res = await serverApiClient<Topic[] | Record<string, Topic>>(
        `/topics/classes/${classId}`,
        { ignoreAuthError: true },
      );
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        const raw = res.data;
        return Array.isArray(raw) ? raw : typeof raw === 'object' ? Object.values(raw) : [];
      }
    } catch {
      // Fallback
    }
    return getMockTopics(classId);
  },

  async getTopicsWithResources(classId: string): Promise<Topic[]> {
    try {
      const res = await serverApiClient<Topic[] | Record<string, Topic>>(
        `/topics/classes/${classId}`,
        { ignoreAuthError: true },
      );
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : typeof raw === 'object' ? Object.values(raw) : [];
        return list;
      }
    } catch {
      // Fallback
    }
    return getMockTopics(classId);
  },
};
