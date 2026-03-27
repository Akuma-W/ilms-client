import { clientFetch } from '@/lib/api/client-fetcher';
import { School } from '@/types/school';

export const schoolService = {
  async getSchools(): Promise<School[]> {
    const result = await clientFetch<School[]>('/schools');

    if (!result.data) {
      throw new Error('Data is invalid');
    }

    return result.data;
  },
};
