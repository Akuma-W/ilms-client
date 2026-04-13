'use server';

import { CLIENT_API_URL } from '@/config';
import { PromiseResponse } from '@/types/api';
import { cookies } from 'next/headers';

export async function apiClient<T>(
  url: string,
  options?: RequestInit & { ignoreAuthError?: boolean },
): PromiseResponse<T> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get('access_token')?.value;

  if (!accessToken && options?.ignoreAuthError) {
    return {
      success: false,
      message: 'Unauthorized',
      data: null,
    };
  }

  try {
    const res = await fetch(`${CLIENT_API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        Cookie: cookiesStore.toString(),
        ...options?.headers,
      },
    });

    if (res.status === 401) {
      return {
        success: false,
        message: 'Unauthorized',
        data: null,
      };
    }

    const result = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: result.success,
        message: result?.message || 'Request failed',
        statusCode: result.statusCode,
        data: null,
      };
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    throw new Error(message);
  }
}
