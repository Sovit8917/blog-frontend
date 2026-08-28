import { NextRequest, NextResponse } from 'next/server';

/**
 * Guards the `/me/*` dashboard routes (applications, saved jobs, bookmarks).
 * This only checks that an `access_token` cookie is present — it doesn't
 * verify the JWT (that's the backend's job via `JwtAuthGuard`); an expired
 * token still lands the visitor on the page, which then gets a 401 from the
 * API and can redirect/show a "please sign in again" state.
 */
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has('access_token');
  if (!hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/me/:path*'],
};
