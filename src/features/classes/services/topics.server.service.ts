import { serverApiClient } from '@/lib/api/server-api-client';
import { Topic } from '@/types/topic';

/**
 * Server-side topics service for Server Components (SSR).
 */
export const topicsServerService = {
  async getTopics(classId: string): Promise<Topic[]> {
    const res = await serverApiClient<Topic[] | Record<string, Topic>>(
      `/topics/classes/${classId}`,
    );
    const raw = res.data;
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') return Object.values(raw);
    return [];
  },
};
