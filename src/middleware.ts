import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const PROTECTED_PREFIXES = ['/me'];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Better Auth issues a single session cookie and manages its own rolling
 * refresh server-side (see `session.updateAge` in the backend's
 * src/auth/better-auth.ts) — there's no separate short-lived access token to
 * proactively refresh here anymore, unlike the old JWT setup. `getSessionCookie`
 * is a fast, DB-free existence/signature check meant for exactly this kind of
 * optimistic edge redirect; the real validation happens wherever the session
 * is actually used (getCurrentUser() on the server, useSession() on the client).
 */
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (isProtected(request.nextUrl.pathname) && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/me/:path*'],
};
