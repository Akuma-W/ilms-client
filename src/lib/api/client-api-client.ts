'use client';

import { CLIENT_API_URL } from '@/config';
import { ApiResponse } from '@/types/api';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Resolves or rejects all pending queued requests once the token refresh process finishes.
 */
function processQueue(error: Error | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null);
    }
  });
  failedQueue = [];
}

/**
 * Client-side API client executing exclusively within browser runtime.
 * Features native credentials forwarding and an automatic 401 token refresh queue.
 */
export async function clientApiClient<T>(
  endpoint: string,
  options?: RequestInit & { skipAutoRefresh?: boolean },
): Promise<ApiResponse<T>> {
  const targetUrl = endpoint.startsWith('http')
    ? endpoint
    : `${CLIENT_API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  try {
    let res = await fetch(targetUrl, {
      ...options,
      headers: defaultHeaders,
      credentials: 'include',
    });

    // Intercept 401 Unauthorized for silent token refreshing
    if (res.status === 401 && !options?.skipAutoRefresh) {
      if (isRefreshing) {
        await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });

        res = await fetch(targetUrl, {
          ...options,
          headers: defaultHeaders,
          credentials: 'include',
        });
      } else {
        isRefreshing = true;

        try {
          const refreshRes = await fetch(`${CLIENT_API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!refreshRes.ok) {
            throw new Error('Refresh token expired or invalid');
          }

          processQueue(null);

          // Retry the original request with the new session cookie
          res = await fetch(targetUrl, {
            ...options,
            headers: defaultHeaders,
            credentials: 'include',
          });
        } catch (refreshError) {
          processQueue(refreshError instanceof Error ? refreshError : new Error('Refresh failed'));

          if (typeof window !== 'undefined') {
            const redirectUrl = encodeURIComponent(
              window.location.pathname + window.location.search,
            );
            window.location.href = `/login?redirect=${redirectUrl}`;
          }

          return {
            success: false,
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            statusCode: 401,
            data: null,
          };
        } finally {
          isRefreshing = false;
        }
      }
    }

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: payload?.message || 'Yêu cầu không thành công.',
        statusCode: res.status,
        data: null,
      };
    }

    return payload as ApiResponse<T>;
  } catch (error) {
    if (
      typeof window !== 'undefined' &&
      error instanceof TypeError &&
      error.message.includes('fetch')
    ) {
      window.dispatchEvent(new CustomEvent('backend:offline'));
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Lỗi kết nối máy chủ.',
      statusCode: 503,
      data: null,
    };
  }
}
