import useSWR from 'swr';
import { adminUsersService } from '../services/admin-users.service';

export function useAdminUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  schoolId?: string;
}) {
  const { data, error, isLoading, mutate } = useSWR(
    [
      'admin/users',
      params?.page ?? 1,
      params?.limit ?? 10,
      params?.search ?? '',
      params?.role ?? '',
      params?.status ?? '',
      params?.schoolId ?? '',
    ],
    () => adminUsersService.getUsers(params),
    { keepPreviousData: true },
  );

  return {
    data,
    users: data?.data || [],
    meta: data?.meta,
    total: data?.meta?.total || 0,
    totalPages: data?.meta?.totalPages || 1,
    isLoading,
    error,
    mutate,
    mutateUsers: mutate,
  };
}
