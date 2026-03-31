import { userService } from '@/features/user/services/user.service';
import { User } from '@/types/user';
import useSWR from 'swr';

export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR<User | null>('/api/users/me', () =>
    userService.getMe(),
  );

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data,
    mutateUser: mutate,
    error,
  };
}
