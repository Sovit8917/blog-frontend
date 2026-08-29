import { apiFetch } from './client';
import type { ReadingHistoryEntry } from '@/types';

/** POST /me/reading-history — upserted per (user, post), requires auth. */
export function logRead(postId: string, progressPct: number) {
  return apiFetch<{ id: string }>('/me/reading-history', {
    method: 'POST',
    body: JSON.stringify({ postId, progressPct }),
    revalidate: false,
  });
}

/** GET /me/reading-history — requires auth. Pass a forwarded cookie header for server components. */
export function listReadingHistory(limit = 30, cookie?: string) {
  return apiFetch<ReadingHistoryEntry[]>(`/me/reading-history?limit=${limit}`, {
    cookie,
    revalidate: false,
  });
}

/** DELETE /me/reading-history — clears the whole history, requires auth. */
export function clearReadingHistory() {
  return apiFetch<{ cleared: boolean }>('/me/reading-history', {
    method: 'DELETE',
    revalidate: false,
  });
}

/** DELETE /me/reading-history/:postId — removes a single entry, requires auth. */
export function removeReadingHistoryEntry(postId: string) {
  return apiFetch<{ removed: boolean }>(`/me/reading-history/${postId}`, {
    method: 'DELETE',
    revalidate: false,
  });
}
