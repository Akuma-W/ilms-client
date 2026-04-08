'use server';

import { cookies } from 'next/headers';
import { authService } from '../services/auth.service';

export async function logoutAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (accessToken) {
    await authService.logout();
  }

  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}
