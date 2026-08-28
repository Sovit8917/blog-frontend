import { cookies } from 'next/headers';
import { getMe } from '@/lib/api';
import type { User } from '@/types';

/**
 * Server Components have no browser cookie jar, so a plain `fetch` from one
 * won't carry the visitor's `access_token` cookie the way client-side
 * `credentials: 'include'` does. This reads the incoming request's cookies
 * (via `next/headers`, App Router only) and forwards them as a raw `Cookie`
 * header on the `GET /auth/me` call.
 */
export async function getCurrentUser(): Promise<User | null> {
  const jar = cookies();
  if (!jar.get('access_token')) return null;

  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  try {
    return await getMe(cookieHeader);
  } catch {
    return null;
  }
}

/** Raw `Cookie` header for the current request — for forwarding into other authed server-side reads. */
export function getCookieHeader(): string {
  return cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
}
