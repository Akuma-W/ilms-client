import { clientApiClient } from '@/lib/api/client-api-client';
import type { SchoolTeacherItem } from '@/types/school';

export const schoolTeachersService = {
  // Searches fellow active teachers in the current user's school
  async getSchoolTeachers(search?: string): Promise<SchoolTeacherItem[]> {
    try {
      const query = new URLSearchParams();
      if (search && search.trim()) {
        query.set('search', search.trim());
      }
      const url = query.toString() ? `/schools/teachers?${query.toString()}` : '/schools/teachers';
      const result = await clientApiClient<SchoolTeacherItem[] | Record<string, SchoolTeacherItem>>(
        url,
      );

      if (result.success !== false && result.data) {
        const raw = result.data;
        const list: SchoolTeacherItem[] = Array.isArray(raw) ? raw : Object.values(raw);
        return list;
      }
    } catch {
      // Fallback
    }
    return [];
  },
};
