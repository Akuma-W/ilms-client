import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from './config/route';

const isMatchRoute = (pathname: string, routes: readonly string[]) => {
  return routes.some((route) => pathname.startsWith(route));
};

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const isLoggedIn = !!token;

  const isProtectedRoute = isMatchRoute(pathname, ROUTES.PROTECTED);
  const isAuthRoute = isMatchRoute(pathname, ROUTES.AUTH);

  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/classes', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
