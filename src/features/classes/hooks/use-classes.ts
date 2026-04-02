'use client';

import useSWR from 'swr';
import { classService } from '../services/class.service';
export function useClasses(params: { page: number; limit: number; search: string }) {
  const key = ['classes', params];

  const { data, error, isLoading } = useSWR(key, () => classService.getClasses(params), {
    keepPreviousData: true,
  });

  return {
    classes: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
  };
}
