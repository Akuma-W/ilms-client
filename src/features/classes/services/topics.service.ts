import { clientApiClient } from '@/lib/api/client-api-client';
import { CreateTopicPayload, Topic } from '@/types/topic';

/**
 * Client-side topics service for Browser Components (CSR, SWR, Mutations).
 */
export const topicsService = {
  async getTopics(classId: string): Promise<Topic[]> {
    const res = await clientApiClient<Topic[] | Record<string, Topic>>(
      `/topics/classes/${classId}`,
    );
    const raw = res.data;
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') return Object.values(raw);
    return [];
  },

  async createTopic(classId: string, payload: CreateTopicPayload) {
    return clientApiClient<Topic>(`/topics/classes/${classId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateTopic(id: string, payload: Partial<CreateTopicPayload>) {
    return clientApiClient<Topic>(`/topics/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async deleteTopic(id: string) {
    return clientApiClient<{ message: string }>(`/topics/${id}`, {
      method: 'DELETE',
    });
  },
};
