import { API_URL } from '@/config';
import { clientFetch } from '@/lib/api/client-fetcher';
import { PromiseResponse } from '@/types/api';
import { GoogleRegisterDto, GoogleUser, RegisterDto } from '@/types/auth';

export const authService = {
  async register(data: RegisterDto): PromiseResponse<{
    userId: string;
  }> {
    const result = await clientFetch<{ userId: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return result;
  },

  googleLogin(): void {
    window.location.href = `${API_URL}/auth/google`;
  },

  async getGoogleUser(): Promise<GoogleUser | null> {
    const { data } = await clientFetch<GoogleUser>('/auth/google/me');
    return data;
  },

  async googleRegister(data: GoogleRegisterDto): PromiseResponse<{
    userId: string;
  }> {
    return clientFetch<{ userId: string }>('/auth/google/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  },
};
