'use client';

import useSWR from 'swr';
import { Class, ClassParams } from '@/types/class';
import { buildClassKey, fetchClasses } from '../utils/classes.utils';
import { QueryResponse } from '@/types/api';
import { ClassTabs } from '@/types/enum';

interface UseClassesParams extends ClassParams {
  initialData?: QueryResponse<Class> | null;
}

export function useClasses({ tab, search, page, limit, subjectId, initialData }: UseClassesParams) {
  const key = buildClassKey(tab, search, page, limit, subjectId);

  const { data, isLoading, error, mutate } = useSWR(
    key,
    ([tab, search, page, limit, subjectId]) => {
      return fetchClasses(tab as ClassTabs, {
        search,
        page: Number(page),
        limit: Number(limit),
        subjectId: subjectId || undefined,
      });
    },
    {
      fallbackData: initialData,
      revalidateOnMount: true,
      revalidateOnFocus: true,
    },
  );

  return {
    classes: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutateClasses: mutate,
  };
}
