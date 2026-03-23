import { LoginDto, RegisterDto } from '@/types/auth.type';
import { API_URL, apiClient } from '../api-client';
import { clearAccessToken, setAccessToken } from '@/lib/token-store';
import { AUTH_ERROR_MAP } from './auth.errors';

export const register = async (dto: RegisterDto) => {
  const res = await apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  const result = await res.json();

  if (!res.ok || !result.success) {
    return {
      success: false,
      message: AUTH_ERROR_MAP[result.message] || 'Có lỗi xảy ra, vui lòng thử lại',
    };
  }

  return result;
};

export const login = async (dto: LoginDto) => {
  const res = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
  const result = await res.json();

  if (!res.ok || !result.success) {
    return {
      success: false,
      message: AUTH_ERROR_MAP[result.message] || 'Có lỗi xảy ra, vui lòng thử lại',
    };
  }

  setAccessToken(result.data.accessToken);

  return result;
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      clearAccessToken();
      return null;
    }

    const { data } = await res.json();

    setAccessToken(data.accessToken);

    return data.accessToken;
  } catch {
    clearAccessToken();
    return null;
  }
};

export const logout = async () => {
  try {
    await apiClient('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    clearAccessToken();
  }
};
