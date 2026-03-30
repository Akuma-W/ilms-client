import { CLIENT_API_URL } from '@/config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (accessToken) {
    try {
      // If have accessToken, call BE to logout in BE
      await fetch(`${CLIENT_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Backend logout failed: ', error);
    }
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set('access_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  response.cookies.set('refresh_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
