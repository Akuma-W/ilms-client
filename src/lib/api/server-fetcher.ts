import { API_URL } from '@/config';
import { cookies } from 'next/headers';

export async function serverFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  let res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`,
      cookie: cookieStore.toString(),
    },
  });

  // Auto refresh if 401
  if (res.status === 401) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        cookie: cookieStore.toString(),
      },
    });
    
    // If refresh successful
    if (refreshRes.ok) {
      // Get new token after refresh
      const newToken = cookieStore.get('access_token')?.value;
      
      res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: newToken ? `Bearer ${newToken}` : '',
        },
      });
    }
  }

  return res;
}
