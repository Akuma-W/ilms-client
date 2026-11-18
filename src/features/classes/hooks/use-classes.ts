'use client';

import useSWR from 'swr';
import { Class, ClassParams } from '@/types/class';
import { buildClassKey, fetchClasses } from '../utils/classes.utils';
import { PaginatedResult } from '@/types/api';
import { ClassTabs } from '@/types/enum';

interface UseClassesParams extends ClassParams {
  role?: string;
  userId?: string;
  initialData?: PaginatedResult<Class> | null;
}

export function useClasses({
  tab,
  search,
  page,
  limit,
  subjectId,
  role,
  userId,
  initialData,
}: UseClassesParams) {
  const key = buildClassKey(tab, search, page, limit, subjectId, role, userId);

  const { data, isLoading, error, mutate } = useSWR(
    key,
    ([tab, search, page, limit, subjectId, role]) => {
      return fetchClasses(
        tab as ClassTabs,
        {
          search,
          page: Number(page),
          limit: Number(limit),
          subjectId: subjectId || undefined,
        },
        role,
      );
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
