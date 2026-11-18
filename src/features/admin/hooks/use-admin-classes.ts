import useSWR from 'swr';
import { adminClassesService } from '../services/admin-classes.service';

export function useAdminClasses(params?: {
  page?: number;
  limit?: number;
  search?: string;
  schoolId?: string;
  subjectId?: string;
  isArchived?: boolean;
}) {
  const { data, error, isLoading, mutate } = useSWR(
    [
      'admin/classes',
      params?.page ?? 1,
      params?.limit ?? 10,
      params?.search ?? '',
      params?.schoolId ?? '',
      params?.subjectId ?? '',
      params?.isArchived,
    ],
    () => adminClassesService.getClasses(params),
    { keepPreviousData: true },
  );

  return {
    data,
    classes: data?.data || [],
    meta: data?.meta,
    total: data?.meta?.total || 0,
    totalPages: data?.meta?.totalPages || 1,
    isLoading,
    error,
    mutate,
    mutateClasses: mutate,
  };
}
