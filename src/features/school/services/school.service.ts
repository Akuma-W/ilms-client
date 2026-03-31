import { apiClient } from '@/lib/api/api-client';
import { School } from '@/types/school';

export const schoolService = {
  async getSchools(): Promise<School[]> {
    const result = await apiClient<School[]>('/schools');

    if (!result.data) {
      throw new Error('Data is invalid');
    }

    return result.data;
  },
};
