import { clientApiClient } from '@/lib/api/client-api-client';
import { materialsService } from '@/features/materials/services/materials.service';
import { referencesService } from '@/features/references/services/references.service';
import { getMockTopics } from '@/mocks/classes/class-data.mock';
import type { CreateTopicPayload, Topic } from '@/types/topic';

let localTopics: Topic[] = [];

/**
 * Client-side topics service for Browser Components (CSR, SWR, Mutations).
 * Encapsulates try/catch and fallback to mock data when API errors or fails.
 */
export const topicsService = {
  getInitialTopics(classId: string, initialTopics: Topic[] = []): Topic[] {
    if (Array.isArray(initialTopics) && initialTopics.length > 0) {
      return initialTopics;
    }
    if (localTopics.length > 0) {
      const matched = localTopics.filter((t) => !classId || t.classId === classId);
      if (matched.length > 0) return matched;
    }
    return getMockTopics(classId);
  },

  async getTopics(classId: string): Promise<Topic[]> {
    try {
      const res = await clientApiClient<Topic[] | Record<string, Topic>>(
        `/topics/classes/${classId}`,
      );
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : typeof raw === 'object' ? Object.values(raw) : [];
        if (list.length > 0) return list;
      }
    } catch {
      // Fallback
    }
    return this.getInitialTopics(classId);
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
              materialsService.getMaterials(topic.id),
              referencesService.getReferences(topic.id),
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
    try {
      const res = await clientApiClient<Topic>(`/topics/classes/${classId}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res;
      }
    } catch {
      // Fallback local mutation
    }

    const newTopic: Topic = {
      id: `top-${Date.now()}`,
      title: payload.title,
      description: payload.description || null,
      classId,
      orderIndex: (localTopics.length || 0) + 1,
      createdBy: 'teacher-admin',
      createdAt: new Date().toISOString(),
      materials: [],
      references: [],
      assignments: [],
      quizzes: [],
    };
    if (localTopics.length === 0) {
      localTopics = [...getMockTopics(classId)];
    }
    localTopics.push(newTopic);
    return { success: true, data: newTopic, message: 'Tạo chủ đề thành công' };
  },

  async updateTopic(id: string, payload: Partial<CreateTopicPayload>) {
    try {
      const res = await clientApiClient<Topic>(`/topics/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res;
      }
    } catch {
      // Fallback local mutation
    }

    if (localTopics.length === 0) {
      localTopics = [...getMockTopics()];
    }
    localTopics = localTopics.map((t) => (t.id === id ? { ...t, ...payload } : t));
    const updated = localTopics.find((t) => t.id === id);
    return { success: true, data: updated, message: 'Cập nhật chủ đề thành công' };
  },

  async deleteTopic(id: string) {
    try {
      const res = await clientApiClient<{ message: string }>(`/topics/${id}`, {
        method: 'DELETE',
      });
      if (res.success !== false) {
        return res;
      }
    } catch {
      // Fallback
    }

    localTopics = localTopics.filter((t) => t.id !== id);
    return { success: true, message: 'Xóa chủ đề thành công' };
  },
};
