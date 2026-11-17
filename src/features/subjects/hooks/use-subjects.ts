import useSWR from 'swr';
import { subjectsService } from '../services/subjects.service';
import type { QuerySubjectParams } from '@/types/subject';

export function useSubjects(params?: QuerySubjectParams) {
  const { data, error, isLoading, mutate } = useSWR(
    [
      'subjects',
      params?.search ?? '',
      params?.page ?? 1,
      params?.limit ?? 50,
      params?.isActive ?? true,
    ],
    () => subjectsService.getSubjects({ limit: 50, isActive: true, ...params }),
    { revalidateOnFocus: false, dedupingInterval: 30000 },
  );

  return {
    subjects: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}
