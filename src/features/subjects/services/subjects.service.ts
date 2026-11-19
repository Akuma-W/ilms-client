import { clientApiClient } from '@/lib/api/client-api-client';
import type { PaginatedResult } from '@/types/api';
import type { QuerySubjectParams, Subject, SubjectClassItem } from '@/types/subject';

export const subjectsService = {
  // Retrieves list of academic subjects with search, pagination and double-defense parsing
  async getSubjects(params?: QuerySubjectParams): Promise<PaginatedResult<Subject>> {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.search) query.set('search', params.search);
      if (params?.isActive !== undefined) query.set('isActive', String(params.isActive));

      const url = query.toString() ? `/subjects?${query.toString()}` : '/subjects';
      const result = await clientApiClient<
        PaginatedResult<Subject> | Subject[] | Record<string, Subject>
      >(url);

      if (result.success !== false && result.data) {
        const raw = result.data;

        // Case 1: Result is wrapped in { data: Subject[], meta: Pagination }
        if (
          typeof raw === 'object' &&
          'data' in raw &&
          Array.isArray((raw as PaginatedResult<Subject>).data)
        ) {
          return raw as PaginatedResult<Subject>;
        }

        // Case 2: Result is directly an array Subject[]
        if (Array.isArray(raw)) {
          return {
            data: raw,
            meta: { page: 1, limit: raw.length, total: raw.length, totalPages: 1 },
          };
        }

        // Case 3: Result is object with index keys { '0': ..., '1': ... }
        if (typeof raw === 'object') {
          const list = Object.values(raw).filter((item): item is Subject =>
            Boolean(item && typeof item === 'object' && 'code' in item),
          );
          return {
            data: list,
            meta: { page: 1, limit: list.length, total: list.length, totalPages: 1 },
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  },

  // Retrieves details of a specific subject
  async getSubject(id: string) {
    try {
      const result = await clientApiClient<Subject>(`/subjects/${id}`);
      if (result.success !== false && result.data) {
        return result.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  // Retrieves all active classes belonging to a specific subject
  async getSubjectClasses(subjectId: string): Promise<SubjectClassItem[]> {
    try {
      const result = await clientApiClient<SubjectClassItem[]>(`/subjects/${subjectId}/classes`);
      if (result.success !== false && result.data) {
        const rawList = Array.isArray(result.data) ? result.data : Object.values(result.data);
        return rawList as SubjectClassItem[];
      }
    } catch {
      // Fallback
    }
    return [];
  },
};
