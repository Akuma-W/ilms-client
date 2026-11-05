import { cookies } from 'next/headers';
import { SERVER_API_URL } from '@/config';
import { ApiResponse } from '@/types/api';

/**
 * Server-side API client executing exclusively within Node.js runtime.
 * Reads HttpOnly cookies via next/headers and forwards them to the NestJS backend.
 */
export async function serverApiClient<T>(
  endpoint: string,
  options?: RequestInit & { ignoreAuthError?: boolean },
): Promise<ApiResponse<T>> {
  if (typeof window !== 'undefined') {
    throw new Error('serverApiClient must only be executed in a server environment.');
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const targetUrl = endpoint.startsWith('http')
    ? endpoint
    : `${SERVER_API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(targetUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        Cookie: cookieStore.toString(),
        ...options?.headers,
      },
    });

    if (res.status === 401 && !options?.ignoreAuthError) {
      return {
        success: false,
        message: 'Unauthorized',
        statusCode: 401,
        data: null,
      };
    }

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: payload?.message || 'Server request failed',
        statusCode: res.status,
        data: null,
      };
    }

    return payload as ApiResponse<T>;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown server connection error',
      statusCode: 503,
      data: null,
    };
  }
}
