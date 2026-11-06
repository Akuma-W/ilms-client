import { clientApiClient } from '@/lib/api/client-api-client';
import { materialsService } from '@/features/materials/services/materials.service';
import { referencesService } from '@/features/references/services/references.service';
import { getMockTopics } from '@/mocks/classes/class-data.mock';
import type { CreateTopicPayload, Topic } from '@/types/topic';

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

  async getTopicsWithResources(classId: string): Promise<Topic[]> {
    try {
      const fetchedTopics = await this.getTopics(classId);
      const safeTopics = Array.isArray(fetchedTopics) ? fetchedTopics : [];
      if (safeTopics.length === 0) {
        return getMockTopics(classId);
      }

      return await Promise.all(
        safeTopics.map(async (topic) => {
          try {
            const [materials, references] = await Promise.all([
              materialsService.getMaterials(topic.id).catch(() => []),
              referencesService.getReferences(topic.id).catch(() => []),
            ]);
            return {
              ...topic,
              materials: Array.isArray(materials) ? materials : topic.materials || [],
              references: Array.isArray(references) ? references : topic.references || [],
            };
          } catch {
            return {
              ...topic,
              materials: topic.materials || [],
              references: topic.references || [],
            };
          }
        }),
      );
    } catch {
      return getMockTopics(classId);
    }
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
