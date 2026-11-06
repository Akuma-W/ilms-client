'use client';

import { userService } from '@/features/user/services/user.service';
import { User } from '@/types/user';
import useSWR from 'swr';

interface UseCurrentUserProps {
  initialUser?: User | null;
}

/**
 * Hook providing current authenticated user state via SWR.
 * Optimizes network overhead by relying on focus revalidation instead of periodic polling.
 */
export function useCurrentUser({ initialUser }: UseCurrentUserProps = {}) {
  const { data, error, isLoading, mutate } = useSWR<User | null>(
    '/users/me',
    () => userService.getMe(),
    {
      fallbackData: initialUser !== undefined ? initialUser : null,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  const isActualLoading = initialUser !== undefined ? false : isLoading;
  const currentUser = data !== undefined ? data : (initialUser ?? null);

  return {
    user: currentUser,
    isLoading: isActualLoading,
    isAuthenticated: !!currentUser,
    mutateUser: mutate,
    error,
  };
}
