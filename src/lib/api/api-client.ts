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

  const res = await fetch(`${CLIENT_API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const errorData = await res.json();

    throw new Error(errorData?.message || 'Request failed');
  }

  const result = await res.json();

  return result;
}
