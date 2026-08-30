import { apiFetch, API_BASE, ApiRequestError, qs } from './client';
import type { ApiError, AuthorSearchResult, AuthorSummary, EmployerRequest, ResumeInfo, UserProfile } from '@/types';

/** GET /users/:username — public profile (name, bio, avatar, post/follow counts). */
export function getUserProfile(username: string) {
  return apiFetch<UserProfile>(`/users/${username}`, {
    revalidate: 120,
    tags: [`user:${username}`],
  });
}

/**
 * GET /users/search — public author lookup for the site search box ("…and
 * authors"). Only ever returns users who have published, so an empty or
 * whitespace query returns nothing rather than the most-followed authors.
 */
export function searchAuthors(query: string, limit = 5) {
  const q = query.trim();
  if (!q) return Promise.resolve<AuthorSearchResult[]>([]);
  return apiFetch<AuthorSearchResult[]>(`/users/search${qs({ q, limit })}`, {
    revalidate: 60,
    tags: ['users'],
  });
}

/**
 * GET /me/following — requires auth. Used server-side (with the visitor's
 * cookie forwarded, see `lib/auth/session.ts`) to check whether the current
 * user already follows the author being viewed, so `FollowButton` can render
 * with the correct initial state instead of flashing "Follow" first.
 */
export function myFollowing(cookie?: string) {
  return apiFetch<Array<{ following: AuthorSummary }>>('/me/following', {
    revalidate: false,
    cookie,
  });
}

/**
 * POST /users/:username/follow — toggles follow state for the current user,
 * requires auth (cookie session client-side). Called from the client
 * (`FollowButton`), never from a server component, so no `cookie` forwarding
 * is needed here.
 */
export function toggleFollow(username: string) {
  return apiFetch<{ following: boolean }>(`/users/${username}/follow`, {
    method: 'POST',
    revalidate: false,
  });
}

/**
 * Employer access request flow: a plain USER asks to post jobs. Admin/Super
 * Admin approval flips their role to AUTHOR, which unlocks the employer
 * dashboard (`/employer/*`, backed by the `cms/jobs` API routes).
 */

/** GET /me/employer-request — the current user's latest request (or null if none). */
export function getOwnEmployerRequest(cookie?: string) {
  return apiFetch<EmployerRequest | null>('/me/employer-request', {
    revalidate: false,
    cookie,
  });
}

/** POST /me/employer-request — submit a new employer access request. */
export function requestEmployerAccess(input: { companyName: string; message?: string }) {
  return apiFetch<EmployerRequest>('/me/employer-request', {
    method: 'POST',
    body: JSON.stringify(input),
    revalidate: false,
  });
}

// ---- Saved resume (#17) ----
// A one-time upload, reused as the default resume on every job application
// (see ApplyJobButton and the backend's job-applications.service.ts fallback).

/** GET /me/resume — requires auth. */
export function getOwnResume(cookie?: string) {
  return apiFetch<ResumeInfo>('/me/resume', { revalidate: false, cookie });
}

/**
 * POST /me/resume — multipart file upload. Bypasses `apiFetch` (which
 * always sends `Content-Type: application/json` and JSON-stringifies the
 * body) since the browser needs to set its own multipart boundary here.
 */
export async function uploadResume(file: File): Promise<ResumeInfo> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/me/resume`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) {
    let payload: ApiError;
    try {
      payload = await res.json();
    } catch {
      payload = { statusCode: res.status, message: res.statusText };
    }
    throw new ApiRequestError(payload);
  }

  const body = await res.json();
  return body?.success === true && 'data' in body ? body.data : body;
}

/** DELETE /me/resume — requires auth. */
export function deleteOwnResume() {
  return apiFetch<{ message: string }>('/me/resume', { method: 'DELETE', revalidate: false });
}
