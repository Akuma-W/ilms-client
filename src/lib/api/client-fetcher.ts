import { API_URL } from '@/config';
import { PromiseResponse } from '@/types/api';

export async function clientFetch<T>(url: string, options?: RequestInit): PromiseResponse<T> {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    throw new Error('Unauthorizated');
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    throw new Error(errorData?.message || 'Request failed');
  }

  const result = await res.json();

  return result;
}
