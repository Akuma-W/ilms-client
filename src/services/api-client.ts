import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/token-store';
import { refreshToken } from './auth/auth.service';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<string | null> | null = null;

export const apiClient = async (url: string, options: RequestInit = {}) => {
  try {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (res.status !== 401) return res;

    // avoid multiple refresh request at the same time
    if (!refreshPromise) {
      refreshPromise = refreshToken();
    }

    const newToken = await refreshPromise;
    refreshPromise = null;

    if (!newToken) {
      clearAccessToken();
      return res;
    }

    setAccessToken(newToken);

    // retry request
    return fetch(`${API_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
    });
  } catch (error) {
    throw new Error(`Không thể kết nối tới server: ${error}`);
  }
};
