import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "./lib/token-store";

// Middlewares
export function proxy(request: NextRequest) {
  const token = getAccessToken();

  const isAuthPage = 
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // not login yet
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // had login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
  ],
};
