import useSWR from 'swr';
import { adminQuizzesService } from '../services/admin-quizzes.service';
import type { AdminQuiz } from '@/types/admin';

export function useAdminQuizzes(params?: {
  page?: number;
  limit?: number;
  search?: string;
  visibility?: string;
  status?: string;
  creatorId?: string;
}) {
  const { data, error, isLoading, mutate } = useSWR(
    [
      'admin/quizzes',
      params?.page ?? 1,
      params?.limit ?? 10,
      params?.search ?? '',
      params?.visibility ?? '',
      params?.status ?? '',
      params?.creatorId ?? '',
    ],
    () => adminQuizzesService.getQuizzes(params),
    { keepPreviousData: true },
  );

  return {
    data,
    quizzes: data?.data || [],
    meta: data?.meta,
    total: data?.meta?.total || 0,
    totalPages: data?.meta?.totalPages || 1,
    isLoading,
    error,
    mutate,
    mutateQuizzes: mutate,
  };
}

export function useAdminQuiz(id?: string | null) {
  const { data, error, isLoading, mutate } = useSWR<AdminQuiz | null>(
    id ? ['admin/quizzes', id] : null,
    () => adminQuizzesService.getQuizDetail(id!),
  );

  return {
    quiz: data || null,
    isLoading,
    error,
    mutate,
  };
}
