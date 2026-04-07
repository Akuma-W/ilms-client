'use client';

import useSWR from 'swr';
import { Class, ClassParams } from '@/types/class';
import { fetchClasses } from '../utils/classes.utils';
import { QueryResponse } from '@/types/api';

interface UseClassesParams extends ClassParams {
  initialData?: QueryResponse<Class[]>;
  initialParams?: ClassParams;
}

export function useClasses({
  tab,
  search,
  page,
  limit,
  initialData,
  initialParams,
}: UseClassesParams) {
  const key = `classes-${tab}-${search}-${page}-${limit}`;

  const isInitial =
    initialParams &&
    tab === initialParams.tab &&
    search === initialParams.search &&
    page === initialParams.page &&
    limit === initialParams.limit;

  const { data, isLoading, mutate } = useSWR(
    key,
    () => fetchClasses(tab, { search, page, limit }),
    {
      fallbackData: isInitial ? initialData : undefined,
      keepPreviousData: true,
      revalidateOnMount: true,
      revalidateOnFocus: true,
    },
  );

  return {
    classes: data?.data || [],
    meta: data?.meta,
    isLoading,
    mutate,
  };
}
