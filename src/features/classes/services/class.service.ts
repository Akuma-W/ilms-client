import { apiClient } from '@/lib/api/api-client';
import { QueryResponse } from '@/types/api';
import { Class } from '@/types/class';

export const classService = {
  async getClasses(params: {
    page: number;
    limit: number;
    search: string;
  }): Promise<QueryResponse<Class[]>> {
    const query = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      search: params.search,
    });

    const result = await apiClient<QueryResponse<Class[]>>(`/classes?${query}`);

    if (!result.data) {
      throw new Error('Data is invalid');
    }

    return result.data;
  },
};
