import type { ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
// The Nest backend mounts every route behind a global prefix (`app.setGlobalPrefix`
// in main.ts, defaulting to `api/v1`). Requests to bare paths like `/posts` 404
// with "Cannot GET /posts" — they need to go to `/api/v1/posts`. Override with
// NEXT_PUBLIC_API_PREFIX if the backend's API_PREFIX env var is ever changed.
// Exported so callers that build backend URLs outside apiFetch (redirect/tracking
// links that must NOT be JSON-parsed, e.g. affiliateHref) stay consistent with it.
export const API_PREFIX = (process.env.NEXT_PUBLIC_API_PREFIX ?? '/api/v1').replace(/\/+$/, '');
export const API_BASE = `${API_URL}${API_PREFIX}`;

export class ApiRequestError extends Error {
  statusCode: number;
  constructor(public payload: ApiError) {
    super(Array.isArray(payload.message) ? payload.message.join(', ') : payload.message);
    this.statusCode = payload.statusCode;
  }
}

// Paths that must never trigger a refresh-and-retry themselves, or a failed
// login/refresh attempt would recurse into refreshing forever.
const NO_REFRESH_PATHS = ['/auth/refresh', '/auth/login', '/auth/register', '/auth/logout'];

// Dedupe concurrent refresh attempts — several components can 401 around the
// same moment (e.g. two client fetches firing together), and they should all
// await one in-flight /auth/refresh call rather than each firing their own.
let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export interface FetchOptions extends RequestInit {
  /** Next.js data-cache revalidation window, in seconds. Omit for `no-store`. */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation via revalidateTag() from webhooks/mutations. */
  tags?: string[];
  token?: string;
  /**
   * Raw `Cookie` header value to forward. Used by server components/actions to
   * carry the visitor's `access_token`/`refresh_token` cookies (via
   * `next/headers` cookies()) into a server-side fetch, since server fetches
   * don't automatically attach the browser's cookie jar the way client-side
   * `fetch(..., { credentials: 'include' })` does.
   */
  cookie?: string;
}

/**
 * Single fetch wrapper for the whole app so every request gets:
 * - a consistent base URL + JSON headers
 * - Next.js fetch-cache config (ISR-style `revalidate`, tag-based invalidation)
 * - normalized error shape matching the Nest `ApiError` contract
 * - on the client, a transparent refresh-and-retry when the short-lived
 *   `access_token` (15min) has expired but the 7-day `refresh_token` cookie
 *   is still good — without this, any interaction more than 15min after
 *   login/last refresh (Apply, Save, etc.) would just fail with a 401 that
 *   looks like the visitor got logged out.
 */
export async function apiFetch<T>(path: string, opts: FetchOptions = {}, _isRetry = false): Promise<T> {
  const { revalidate, tags, token, cookie, headers, ...rest } = opts;
  const isClient = typeof window !== 'undefined';

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
    // Browser requests carry the httpOnly auth cookies automatically; server-side
    // requests (Server Components/Route Handlers) have no cookie jar, so those
    // callers forward one explicitly via `cookie` (see lib/auth/session.ts).
    ...(isClient ? { credentials: 'include' as const } : {}),
    // Default: cache for 60s at the edge/data-cache; callers override per-endpoint.
    next: {
      revalidate: revalidate === false ? undefined : (revalidate ?? 60),
      tags,
    },
    cache: revalidate === false ? 'no-store' : undefined,
  });

  if (res.status === 401 && isClient && !_isRetry && !NO_REFRESH_PATHS.includes(path)) {
    const refreshed = await refreshSession();
    if (refreshed) return apiFetch<T>(path, opts, true);
  }

  if (!res.ok) {
    let payload: ApiError;
    try {
      payload = await res.json();
    } catch {
      payload = { statusCode: res.status, message: res.statusText };
    }
    throw new ApiRequestError(payload);
  }

  if (res.status === 204) return undefined as T;

  const body = await res.json();
  // The backend's global TransformInterceptor wraps every successful response
  // as `{ success: true, data: <actual payload> }` (see
  // src/common/interceptors/transform.interceptor.ts on the backend). Every
  // caller in this app is typed against the *unwrapped* shape (e.g.
  // `CursorPage<PostCard>`, `Category[]`), so unwrap it once here rather than
  // making every lib/api/* function and every component defend against the
  // envelope separately.
  if (body && typeof body === 'object' && body.success === true && 'data' in body) {
    return body.data as T;
  }
  return body as T;
}

export function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const str = search.toString();
  return str ? `?${str}` : '';
}
