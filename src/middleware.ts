import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const API_PREFIX = (process.env.NEXT_PUBLIC_API_PREFIX ?? '/api/v1').replace(/\/+$/, '');

const PROTECTED_PREFIXES = ['/me'];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

/**
 * `access_token` is intentionally short-lived (15min — see auth.controller.ts
 * on the backend) and `refresh_token` lasts 7 days. Previously nothing ever
 * called `POST /auth/refresh`, so every visitor got silently logged out
 * ~15 minutes after login even though their refresh token was still valid —
 * `getCurrentUser()` in the root layout would 401 and this middleware would
 * boot anyone off `/me/*` the moment `access_token` expired.
 *
 * This now runs on (almost) every request: if `access_token` is missing but
 * `refresh_token` is present, it silently exchanges it for a new token pair
 * *before* the page renders, so Server Components in this same request see a
 * valid session and the browser gets fresh cookies for the next request too.
 */
export async function middleware(request: NextRequest) {
  const hasAccessToken = request.cookies.has('access_token');
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!hasAccessToken && refreshToken) {
    const refreshed = await tryRefresh(refreshToken, request);
    if (refreshed) return refreshed;
  }

  if (isProtected(request.nextUrl.pathname) && !request.cookies.has('access_token')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

async function tryRefresh(refreshToken: string, request: NextRequest): Promise<NextResponse | null> {
  try {
    const res = await fetch(`${API_URL}${API_PREFIX}/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: `refresh_token=${refreshToken}` },
    });
    if (!res.ok) return null;

    const body = await res.json().catch(() => null);
    const data = body?.data ?? body;
    const accessToken: string | undefined = data?.accessToken;
    const newRefreshToken: string | undefined = data?.refreshToken;
    if (!accessToken || !newRefreshToken) return null;

    // Attach to *this* request's cookie jar too, so getCurrentUser() and any
    // other Server Component reading cookies() during this render sees the
    // new access_token instead of waiting for the next navigation.
    request.cookies.set('access_token', accessToken);
    request.cookies.set('refresh_token', newRefreshToken);

    const response = NextResponse.next({ request });
    response.cookies.set('access_token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 });
    response.cookies.set('refresh_token', newRefreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 });
    return response;
  } catch {
    // Backend unreachable — fall through and let the normal logged-out path handle it.
    return null;
  }
}

export const config = {
  // Everything except static assets/images and Next's own internals — the
  // silent refresh needs to run ahead of any page that might read the
  // session, not just the /me/* dashboard.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
