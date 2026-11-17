import { clientApiClient } from '@/lib/api/client-api-client';
import type { QueryResponse } from '@/types/api';
import type { QuerySubjectParams, Subject, SubjectClassItem } from '@/types/subject';

const MOCK_FALLBACK_SUBJECTS: Subject[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    code: 'IT001',
    name: 'Nhập môn lập trình',
    credits: 3,
    isActive: true,
    description: 'Học phần cơ sở ngành trang bị tư duy giải thuật và lập trình',
    schoolId: 'school-default',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    code: 'IT003',
    name: 'Cấu trúc dữ liệu và giải thuật',
    credits: 4,
    isActive: true,
    description: 'Học phần nâng cao về mảng, danh sách liên kết, cây và đồ thị',
    schoolId: 'school-default',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    code: 'SE347',
    name: 'Công nghệ Web và Ứng dụng',
    credits: 3,
    isActive: true,
    description: 'Xây dựng ứng dụng web hiện đại với React, Next.js và NestJS',
    schoolId: 'school-default',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    code: 'SS007',
    name: 'Kinh tế chính trị Mác - Lênin',
    credits: 2,
    isActive: true,
    description: 'Học phần đại cương bắt buộc',
    schoolId: 'school-default',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  },
];

export const subjectsService = {
  // Retrieves list of academic subjects with search, pagination and double-defense parsing
  async getSubjects(params?: QuerySubjectParams): Promise<QueryResponse<Subject>> {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.search) query.set('search', params.search);
      if (params?.isActive !== undefined) query.set('isActive', String(params.isActive));

      const url = query.toString() ? `/subjects?${query.toString()}` : '/subjects';
      const result = await clientApiClient<
        QueryResponse<Subject> | Subject[] | Record<string, Subject>
      >(url);

      if (result.success !== false && result.data) {
        const raw = result.data;

        // Case 1: Result is wrapped in { data: Subject[], meta: Pagination }
        if (
          typeof raw === 'object' &&
          'data' in raw &&
          Array.isArray((raw as QueryResponse<Subject>).data)
        ) {
          const typed = raw as QueryResponse<Subject>;
          if (typed.data.length > 0) return typed;
        }

        // Case 2: Result is directly an array Subject[]
        if (Array.isArray(raw) && raw.length > 0) {
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
          if (list.length > 0) {
            return {
              data: list,
              meta: { page: 1, limit: list.length, total: list.length, totalPages: 1 },
            };
          }
        }
      }
    } catch {
      // Fallback
    }

    // Fallback UIT subjects if database has not seeded or offline
    return {
      data: MOCK_FALLBACK_SUBJECTS,
      meta: { page: 1, limit: 10, total: MOCK_FALLBACK_SUBJECTS.length, totalPages: 1 },
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
