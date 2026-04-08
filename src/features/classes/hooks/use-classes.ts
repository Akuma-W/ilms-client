'use client';

import useSWR from 'swr';
import { Class, ClassParams } from '@/types/class';
import { fetchClasses } from '../utils/classes.utils';
import { QueryResponse } from '@/types/api';
import { ClassTabs } from '@/types';

interface UseClassesParams extends ClassParams {
  initialData?: QueryResponse<Class[]>;
}

export function useClasses({ tab, search, page, limit, initialData }: UseClassesParams) {
  const key = [String(tab), String(search || ''), String(page || ''), String(limit || '')];

  const { data, isLoading, mutate } = useSWR(
    key,
    ([tab, search, page, limit]) => {
      console.log('CSR fetch classes with keys: ', key);
      return fetchClasses(tab as ClassTabs, { search, page, limit });
    },
    {
      fallbackData: initialData,
      revalidateOnMount: false,
      revalidateIfStale: false,
    },
  );

  return {
    classes: data?.data || [],
    meta: data?.meta,
    isLoading,
    mutate,
  };
}
