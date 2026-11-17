import useSWR from 'swr';
import { subjectsService } from '../services/subjects.service';

export function useSubjectClasses(subjectId?: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    subjectId ? ['subject-classes', subjectId] : null,
    () => subjectsService.getSubjectClasses(subjectId!),
    { revalidateOnFocus: false },
  );

  return {
    classes: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
