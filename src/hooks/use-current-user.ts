'use client';

import { userService } from '@/features/user/services/user.service';
import { User } from '@/types/user';
import useSWR from 'swr';

interface UseCurrentUserProps {
  initialUser?: User | null;
}

export function useCurrentUser({ initialUser }: UseCurrentUserProps = {}) {
  const { data, error, isLoading, mutate } = useSWR<User | null>(
    '/users/me',
    () => userService.getMe(),
    {
      fallbackData: initialUser || null,
    },
  );

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data,
    mutateUser: mutate,
    error,
  };
}
