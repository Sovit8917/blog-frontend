import { cookies } from 'next/headers';
import type { User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

/**
 * Server Components have no browser cookie jar, so a plain `fetch` from one
 * won't carry the visitor's Better Auth session cookie the way client-side
 * `credentials: 'include'` does. This reads the incoming request's cookies
 * (via `next/headers`, App Router only) and forwards them as a raw `Cookie`
 * header on Better Auth's own `GET /auth/get-session` endpoint.
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieHeader = getCookieHeader();
  if (!cookieHeader) return null;

  try {
    const res = await fetch(`${API_URL}/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const session = await res.json().catch(() => null);
    if (!session?.user) return null;

    const u = session.user as Record<string, unknown>;
    return {
      id: u.id as string,
      username: u.username as string,
      name: u.name as string,
      email: u.email as string,
      avatarUrl: (u.image as string | null) ?? null,
      bio: (u.bio as string | null) ?? null,
      role: u.role as User['role'],
    };
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
