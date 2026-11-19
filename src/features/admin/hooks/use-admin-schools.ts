import useSWR from 'swr';
import { adminSchoolService } from '../services/admin-schools.service';

export function useAdminSchools(params?: {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  status?: 'active' | 'deactivated' | 'archived';
}) {
  const { data, error, isLoading, mutate } = useSWR(
    [
      'admin/schools',
      params?.page ?? 1,
      params?.limit ?? 10,
      params?.search ?? '',
      params?.city ?? '',
      params?.status ?? '',
    ],
    () => adminSchoolService.getSchools(params),
    { keepPreviousData: true },
  );

  return {
    data,
    schools: data?.data || [],
    meta: data?.meta,
    total: data?.meta?.total || 0,
    totalPages: data?.meta?.totalPages || 1,
    isLoading,
    error,
    mutate,
    mutateSchools: mutate,
  };
}

export function useAdminSchoolSubjects(schoolId?: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    schoolId ? ['admin/schools/subjects', schoolId] : null,
    () => adminSchoolService.getSchoolSubjects(schoolId!),
  );

  return {
    subjects: data || [],
    isLoading,
    error,
    mutate,
  };
}
