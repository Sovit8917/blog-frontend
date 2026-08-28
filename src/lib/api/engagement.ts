import { apiFetch } from './client';
import type { Comment, Post } from '@/types';

/** GET /posts/:postId/comments — approved, threaded comments for a post. */
export function listComments(postId: string) {
  return apiFetch<Comment[]>(`/posts/${postId}/comments`, {
    revalidate: 30,
    tags: [`comments:${postId}`],
  });
}

/**
 * These all require auth. Like the rest of the app (see lib/api/client.ts),
 * auth is carried via the httpOnly `access_token` cookie — client calls send
 * it automatically (`credentials: 'include'`), server calls forward it via
 * `cookie` (see lib/auth/session.ts). There's no bearer token available on
 * the client to pass, so these do NOT take a `token` argument.
 */

/** POST /comments — requires auth. */
export function createComment(input: { postId: string; content: string; parentId?: string }) {
  return apiFetch<Comment>('/comments', {
    method: 'POST',
    body: JSON.stringify(input),
    revalidate: false,
  });
}

/** POST /posts/:postId/like — toggle like, requires auth. */
export function toggleLike(postId: string) {
  return apiFetch<{ liked: boolean; likeCount: number }>(`/posts/${postId}/like`, {
    method: 'POST',
    revalidate: false,
  });
}

/** POST /posts/:postId/bookmark — toggle bookmark, requires auth. */
export function toggleBookmark(postId: string) {
  return apiFetch<{ bookmarked: boolean }>(`/posts/${postId}/bookmark`, {
    method: 'POST',
    revalidate: false,
  });
}

/** GET /me/bookmarks — requires auth. Pass a forwarded cookie header for server components. */
export function listMyBookmarks(cookie?: string) {
  return apiFetch<Array<{ id: string; createdAt: string; post: Post }>>('/me/bookmarks', {
    cookie,
    revalidate: false,
  });
}
