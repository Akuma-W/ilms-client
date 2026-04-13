import { CLIENT_API_URL } from '@/config';
import { apiClient } from '@/lib/api/api-client';
import { PromiseResponse } from '@/types/api';
import { GoogleRegisterDto, GoogleUser, RegisterDto } from '@/types/auth';

export const authService = {
  async register(data: RegisterDto): PromiseResponse<{
    userId: string;
  }> {
    const result = await apiClient<{ userId: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success === false) {
      throw new Error(result.message);
    }

    return result;
  },

  googleLogin(): void {
    window.location.href = `${CLIENT_API_URL}/auth/google`;
  },

  async getGoogleUser(): Promise<GoogleUser | null> {
    const { data } = await apiClient<GoogleUser>('/auth/google/me');
    return data;
  },

  async googleRegister(data: GoogleRegisterDto): PromiseResponse<{
    userId: string;
  }> {
    return apiClient<{ userId: string }>('/auth/google/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<string> {
    const { message } = await apiClient<null>('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    return message;
  },
};
