'use server';

import { cookies } from 'next/headers';
import { serverApiClient } from '@/lib/api/server-api-client';

/**
 * Server Action executing logout exclusively in Node.js runtime.
 * Safely notifies the backend and clears HttpOnly session cookies.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  try {
    if (accessToken) {
      await serverApiClient('/auth/logout', { method: 'POST' });
    }
  } catch {
    // Backend offline or token expired - proceed safely to clear client cookies
  }

  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}
