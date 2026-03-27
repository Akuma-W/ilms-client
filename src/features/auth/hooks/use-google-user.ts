import { authService } from '@/features/auth/services/auth.service';
import { GoogleUser } from '@/types/auth';
import useSWR from 'swr';

export function useGoogleUser() {
  const { data, error, isLoading } = useSWR<GoogleUser | null>(
    '/auth/google/me',
    authService.getGoogleUser,
  );

  return { user: data, error, isLoading };
}
