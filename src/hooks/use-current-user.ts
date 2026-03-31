import { User } from '@/types/user';
import useSWR from 'swr';

const fetcher = async (url: string): Promise<User | null> => {
  const res = await fetch(url, { credentials: 'include' });

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error('Unauthorizated');
  }

  const result = await res.json();

  return result.data;
};

export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR<User | null>('/api/users/me', fetcher);

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data,
    mutateUser: mutate,
    error,
  };
}
