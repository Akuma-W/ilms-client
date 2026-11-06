import { clientApiClient } from '@/lib/api/client-api-client';
import type { CreateMaterialPayload, Material, UpdateMaterialPayload } from '@/types/material';

/**
 * Client-side materials service for Browser Components (CSR, SWR, Mutations).
 */
export const materialsService = {
  async getMaterials(topicId: string): Promise<Material[]> {
    const res = await clientApiClient<Material[] | Record<string, Material>>(
      `/materials/topics/${topicId}`,
    );
    const raw = res.data;
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') return Object.values(raw);
    return [];
  },

  async createMaterial(topicId: string, payload: CreateMaterialPayload) {
    return clientApiClient<Material>(`/materials/topics/${topicId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateMaterial(id: string, payload: UpdateMaterialPayload) {
    return clientApiClient<Material>(`/materials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async deleteMaterial(id: string) {
    return clientApiClient<{ message: string }>(`/materials/${id}`, {
      method: 'DELETE',
    });
  },
};
