import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from './config/route';

interface JwtPayload {
  id?: string;
  role?: string;
  exp?: number;
}

/**
 * Parses JWT payload safely without external dependencies.
 */
function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Checks if current path starts with any route in list.
 */
const isMatchRoute = (pathname: string, routes: readonly string[]) => {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
};

/**
 * Next.js 16 Edge Proxy function.
 * Manages route protection, RBAC, and automatic token refresh at the Edge.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow internal health-check route without interception
  if (pathname.startsWith('/api/health-check')) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  const isProtectedRoute = isMatchRoute(pathname, ROUTES.PROTECTED);
  const isAuthRoute = isMatchRoute(pathname, ROUTES.AUTH);
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');

  let validToken = accessToken;
  let payload = validToken ? decodeJwt(validToken) : null;
  const isTokenExpired = payload?.exp ? payload.exp * 1000 < Date.now() : true;

  let refreshedResponse: NextResponse | null = null;

  // Auto-refresh token at the Edge if access_token is expired but refresh_token exists
  if ((!validToken || isTokenExpired) && refreshToken && (isProtectedRoute || isAdminRoute)) {
    try {
      const serverApiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL || 'http://localhost:5000/api/v1';
      const refreshRes = await fetch(`${serverApiUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `refresh_token=${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        // Forward newly set cookies to both Next.js request and browser response
        const setCookieHeaders = refreshRes.headers.getSetCookie();
        refreshedResponse = NextResponse.next();

        for (const cookieStr of setCookieHeaders) {
          const [nameValue] = cookieStr.split(';');
          const [name, val] = nameValue.split('=');
          const trimmedName = name.trim();
          const trimmedVal = val ? val.trim() : '';

          if (trimmedName === 'access_token') {
            validToken = trimmedVal;
            payload = decodeJwt(validToken);
          }

          refreshedResponse.cookies.set(trimmedName, trimmedVal, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
          });
          request.cookies.set(trimmedName, trimmedVal);
        }
      }
    } catch {
      // Backend is unreachable or network failure.
      // Token cannot be refreshed. Let it proceed to auth check;
      // the client BackendConnectionModal will display connection status overlay.
    }
  }

  const isLoggedIn = !!validToken && payload && (!payload.exp || payload.exp * 1000 > Date.now());

  // 1. Unauthenticated user trying to access protected routes
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user trying to access auth pages (login/register)
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/classes', request.url));
  }

  // 3. RBAC: Restrict /admin route to users with 'admin' role
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (payload?.role !== 'admin') {
      return NextResponse.redirect(new URL('/classes', request.url));
    }
  }

  return refreshedResponse || NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
