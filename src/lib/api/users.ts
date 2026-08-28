import { apiFetch } from './client';
import type { AuthorSummary, EmployerRequest, UserProfile } from '@/types';

/** GET /users/:username — public profile (name, bio, avatar, post/follow counts). */
export function getUserProfile(username: string) {
  return apiFetch<UserProfile>(`/users/${username}`, {
    revalidate: 120,
    tags: [`user:${username}`],
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
