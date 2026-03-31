'use server';

import { SERVER_API_URL } from '@/config';
import { cookies } from 'next/headers';

export async function serverFetch(url: string, options?: RequestInit): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  let res = await fetch(`${SERVER_API_URL}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  });

  // Auto refresh if 401
  if (res.status === 401) {
    const refreshRes = await fetch(`${SERVER_API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    // If refresh successful
    if (refreshRes.ok) {
      // Get new token after refresh
      const refreshData = await refreshRes.json();
      const newToken = refreshData.access_token;

      res = await fetch(`${SERVER_API_URL}${url}`, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  }

  return res;
}
