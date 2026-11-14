'use client';

import useSWR from 'swr';
import { quizzesService } from '@/features/quizzes/services/quizzes.service';
import type { PaginatedQuizzesResult, Quiz, QueryQuizInput } from '@/types/quiz';

// Builds a stable SWR cache key from query parameters
function buildQuizzesKey(query: QueryQuizInput): string {
  const params = new URLSearchParams();
  if (query.scope) params.set('scope', query.scope);
  if (query.search) params.set('search', query.search);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  return `/quizzes?${params.toString()}`;
}

interface UseQuizzesOptions {
  query: QueryQuizInput;
  initialData?: PaginatedQuizzesResult<Quiz>;
}

interface UseQuizzesReturn {
  data: PaginatedQuizzesResult<Quiz> | undefined;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;
}

// Fetches paginated quizzes; used by both Public Library and My Quizzes tabs
export function useQuizzes({ query, initialData }: UseQuizzesOptions): UseQuizzesReturn {
  const key = buildQuizzesKey(query);

  const { data, error, isLoading, mutate } = useSWR<PaginatedQuizzesResult<Quiz>>(
    key,
    () => quizzesService.getQuizzes(query),
    {
      fallbackData: initialData,
      revalidateOnMount: !initialData,
      keepPreviousData: true,
    },
  );

  const errorMessage = error instanceof Error ? error.message : error ? String(error) : null;

  return { data, isLoading, error: errorMessage, mutate };
}
