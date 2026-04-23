'use client';

import useSWR from 'swr';
import { Class, ClassParams } from '@/types/class';
import { buildClassKey, fetchClasses } from '../utils/classes.utils';
import { QueryResponse } from '@/types/api';
import { ClassTabs } from '@/types';

interface UseClassesParams extends ClassParams {
  initialData?: QueryResponse<Class> | null;
}

export function useClasses({ tab, search, page, limit, initialData }: UseClassesParams) {
  const key = buildClassKey(tab, search, page, limit);

  const { data, isLoading, error, mutate } = useSWR(
    key,
    ([tab, search, page, limit]) => {
      return fetchClasses(tab as ClassTabs, { search, page: Number(page), limit: Number(limit) });
    },
    {
      fallbackData: initialData,
      revalidateOnMount: false,
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
