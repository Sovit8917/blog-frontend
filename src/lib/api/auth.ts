import { apiFetch } from './client';
import type { AuthTokens, User } from '@/types';

/**
 * The backend sets httpOnly `access_token`/`refresh_token` cookies on
 * register/login/refresh (see auth.controller.ts), so the browser never needs
 * to hold the JWT itself — every call here relies on `credentials: 'include'`
 * (the client-side default in `apiFetch`) rather than an Authorization header.
 */

export function register(input: {
  email: string;
  username: string;
  name: string;
  password: string;
}) {
  return apiFetch<AuthTokens>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
    revalidate: false,
  });
}

export function login(input: { email: string; password: string }) {
  return apiFetch<AuthTokens>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
    revalidate: false,
  });
}

/** POST /auth/logout — requires auth (cookie session). */
export function logout() {
  return apiFetch<{ message: string }>('/auth/logout', { method: 'POST', revalidate: false });
}

/**
 * POST /auth/refresh — exchanges the (7-day) `refresh_token` cookie for a new
 * `access_token`/`refresh_token` pair. `apiFetch` already calls this
 * automatically on a 401 (see client.ts), so components shouldn't normally
 * need to call it directly — it's exported mainly for the background refresh
 * in AuthProvider.
 */
export function refresh() {
  return apiFetch<AuthTokens>('/auth/refresh', { method: 'POST', revalidate: false });
}

/** GET /auth/me — resolves the current session from cookies (or a forwarded `cookie` on the server). */
export function getMe(cookie?: string) {
  return apiFetch<User>('/auth/me', { revalidate: false, cookie });
}
