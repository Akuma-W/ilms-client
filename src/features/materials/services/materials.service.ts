import { clientApiClient } from '@/lib/api/client-api-client';
import { MOCK_MATERIALS, getMockTopics } from '@/mocks/classes/class-data.mock';
import type { CreateMaterialPayload, Material, UpdateMaterialPayload } from '@/types/material';
import type { Topic } from '@/types/topic';

let localMaterials: Material[] = [...MOCK_MATERIALS];

/**
 * Client-side materials service for Browser Components (CSR, SWR, Mutations).
 * Encapsulates try/catch and fallback to mock data when API errors or fails.
 */
export const materialsService = {
  getInitialMaterials(topicId?: string): Material[] {
    if (topicId) {
      return localMaterials.filter((m) => m.topicId === topicId);
    }
    return localMaterials;
  },

  async getMaterials(topicId: string): Promise<Material[]> {
    try {
      const res = await clientApiClient<Material[] | Record<string, Material>>(
        `/materials/topics/${topicId}`,
      );
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : typeof raw === 'object' ? Object.values(raw) : [];
        if (list.length > 0) return list;
      }
    } catch {
      // Fallback to mock
    }
    return localMaterials.filter((m) => m.topicId === topicId);
  },

  async getAllMaterialsWithTopic(
    classId: string,
    topics?: Topic[],
  ): Promise<{
    topics: Topic[];
    materials: (Material & { topicTitle?: string })[];
  }> {
    const topicList = topics && topics.length > 0 ? topics : getMockTopics(classId);
    const materialsWithTopic = localMaterials.map((item) => ({
      ...item,
      topicTitle: topicList.find((t) => t.id === item.topicId)?.title,
    }));
    return {
      topics: topicList,
      materials: materialsWithTopic,
    };
  },

  async createMaterial(topicId: string, payload: CreateMaterialPayload) {
    try {
      const res = await clientApiClient<Material>(`/materials/topics/${topicId}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res;
      }
    } catch {
      // Fallback local mutation
    }

    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      title: payload.title,
      materialType: payload.materialType,
      fileUrl: payload.fileUrl || null,
      externalUrl: payload.externalUrl || null,
      topicId,
      createdAt: new Date().toISOString(),
    };
    localMaterials.push(newMaterial);
    return { success: true, data: newMaterial, message: 'Tạo bài giảng thành công' };
  },

  async updateMaterial(id: string, payload: UpdateMaterialPayload) {
    try {
      const res = await clientApiClient<Material>(`/materials/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res;
      }
    } catch {
      // Fallback local mutation
    }

    localMaterials = localMaterials.map((m) => (m.id === id ? { ...m, ...payload } : m));
    const updated = localMaterials.find((m) => m.id === id);
    return { success: true, data: updated, message: 'Cập nhật bài giảng thành công' };
  },

  async deleteMaterial(id: string) {
    try {
      const res = await clientApiClient<{ message: string }>(`/materials/${id}`, {
        method: 'DELETE',
      });
      if (res.success !== false) {
        return res;
      }
    } catch {
      // Fallback
    }

    localMaterials = localMaterials.filter((m) => m.id !== id);
    return { success: true, message: 'Xóa bài giảng thành công' };
  },
};
