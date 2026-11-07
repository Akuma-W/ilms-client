import { clientApiClient } from '@/lib/api/client-api-client';
import { MOCK_REFERENCES } from '@/mocks/classes/class-data.mock';
import type { CreateReferencePayload, Reference, UpdateReferencePayload } from '@/types/reference';

let localReferences: Reference[] = [...MOCK_REFERENCES];

/**
 * Client-side references service for Browser Components (CSR, SWR, Mutations).
 * Encapsulates try/catch and fallback to mock data when API errors or fails.
 */
export const referencesService = {
  getInitialReferences(topicId?: string): Reference[] {
    if (topicId) {
      return localReferences.filter((r) => r.topicId === topicId);
    }
    return localReferences;
  },

  async getReferences(topicId: string): Promise<Reference[]> {
    try {
      const res = await clientApiClient<Reference[] | Record<string, Reference>>(
        `/references/topics/${topicId}`,
      );
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : typeof raw === 'object' ? Object.values(raw) : [];
        if (list.length > 0) return list;
      }
    } catch {
      // Fallback
    }
    return localReferences.filter((r) => r.topicId === topicId);
  },

  async createReference(topicId: string, payload: CreateReferencePayload) {
    try {
      const res = await clientApiClient<Reference>(`/references/topics/${topicId}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res;
      }
    } catch {
      // Fallback
    }

    const newRef: Reference = {
      id: `ref-${Date.now()}`,
      title: payload.title,
      description: payload.description || null,
      url: payload.url,
      topicId,
      createdAt: new Date().toISOString(),
    };
    localReferences.push(newRef);
    return { success: true, data: newRef, message: 'Thêm tài liệu tham khảo thành công' };
  },

  async updateReference(id: string, payload: UpdateReferencePayload) {
    try {
      const res = await clientApiClient<Reference>(`/references/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      if (res.success !== false && res.data !== null && res.data !== undefined) {
        return res;
      }
    } catch {
      // Fallback
    }

    localReferences = localReferences.map((r) => (r.id === id ? { ...r, ...payload } : r));
    const updated = localReferences.find((r) => r.id === id);
    return { success: true, data: updated, message: 'Cập nhật tài liệu tham khảo thành công' };
  },

  async deleteReference(id: string) {
    try {
      const res = await clientApiClient<{ message: string }>(`/references/${id}`, {
        method: 'DELETE',
      });
      if (res.success !== false) {
        return res;
      }
    } catch {
      // Fallback
    }

    localReferences = localReferences.filter((r) => r.id !== id);
    return { success: true, message: 'Xóa tài liệu tham khảo thành công' };
  },
};
