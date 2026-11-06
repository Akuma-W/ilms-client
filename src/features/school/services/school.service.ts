import { clientApiClient } from '@/lib/api/client-api-client';
import { School } from '@/types/school';

export const schoolService = {
  async getSchools(): Promise<School[]> {
    const result = await clientApiClient<School[]>('/schools');
    return result.data || [];
  },
};
