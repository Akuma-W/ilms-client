import { clientApiClient } from '@/lib/api/client-api-client';
import { CreateMaterialPayload, Material } from '@/types/topic';
import { CLIENT_API_URL } from '@/config';

/**
 * Client-side materials service for Browser Components (CSR, SWR, Upload, Mutations).
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

  async updateMaterial(id: string, payload: Partial<CreateMaterialPayload>) {
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

  /**
   * Upload file to MinIO object storage via NestJS storage controller.
   */
  async uploadFile(formData: FormData): Promise<{
    success: boolean;
    message?: string;
    data: { url: string; key: string } | null;
  }> {
    try {
      const targetUrl = `${CLIENT_API_URL}/storage/upload?folder=materials`;
      const res = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          success: false,
          message: data?.message || 'Tải tệp tin lên thất bại',
          data: null,
        };
      }

      return {
        success: true,
        data: data?.data || data,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối khi tải tệp',
        data: null,
      };
    }
  },
};
