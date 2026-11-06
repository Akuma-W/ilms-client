import { clientApiClient } from '@/lib/api/client-api-client';
import type { CreateReferencePayload, Reference, UpdateReferencePayload } from '@/types/reference';

/**
 * Client-side references service for Browser Components (CSR, SWR, Mutations).
 */
export const referencesService = {
  async getReferences(topicId: string): Promise<Reference[]> {
    const res = await clientApiClient<Reference[] | Record<string, Reference>>(
      `/references/topics/${topicId}`,
    );
    const raw = res.data;
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') return Object.values(raw);
    return [];
  },

  async createReference(topicId: string, payload: CreateReferencePayload) {
    return clientApiClient<Reference>(`/references/topics/${topicId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateReference(id: string, payload: UpdateReferencePayload) {
    return clientApiClient<Reference>(`/references/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async deleteReference(id: string) {
    return clientApiClient<{ message: string }>(`/references/${id}`, {
      method: 'DELETE',
    });
  },
};
