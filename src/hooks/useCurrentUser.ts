import { User } from '@/types/user';
import useSWR from 'swr';

const fetcher = async (url: string): Promise<User> => {
  const res = await fetch(url, { credentials: "include" });

  if (!res.ok) {
    throw new Error("Unauthorizated");
  }

  const result = await res.json();

  return result.data;
};

export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR<User>(
    "/api/users/me",
    fetcher,
  );

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data,
    mutateUser: mutate,
    error,
  };
}
