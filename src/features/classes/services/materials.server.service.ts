import { serverApiClient } from '@/lib/api/server-api-client';
import { Material } from '@/types/topic';

/**
 * Server-side materials service for Server Components (SSR).
 */
export const materialsServerService = {
  async getMaterials(topicId: string): Promise<Material[]> {
    const res = await serverApiClient<Material[] | Record<string, Material>>(
      `/materials/topics/${topicId}`,
    );
    const raw = res.data;
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') return Object.values(raw);
    return [];
  },
};
