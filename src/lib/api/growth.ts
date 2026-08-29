import { apiFetch } from './client';
import type { MostReadPost, PostCard, TopicFollowEntry } from '@/types';

/** POST /categories/:slug/follow — toggle, requires auth. */
export function toggleTopicFollow(categorySlug: string) {
  return apiFetch<{ following: boolean }>(`/categories/${categorySlug}/follow`, {
    method: 'POST',
    revalidate: false,
  });
}

/** GET /me/followed-topics — requires auth. Pass a forwarded cookie header for server components. */
export function listFollowedTopics(cookie?: string) {
  return apiFetch<TopicFollowEntry[]>('/me/followed-topics', { cookie, revalidate: false });
}

/** GET /posts/most-read — public, powers the "🔥 Most Read This Week" homepage rail. */
export function listMostRead(days = 7, limit = 10) {
  return apiFetch<MostReadPost[]>(`/posts/most-read?days=${days}&limit=${limit}`, {
    revalidate: 300,
    tags: ['posts', 'most-read'],
  });
}

/** GET /feed/for-you — requires auth. Personalized ranked feed. Pass a forwarded cookie header for server components. */
export function listForYou(limit = 20, cookie?: string) {
  return apiFetch<PostCard[]>(`/feed/for-you?limit=${limit}`, { cookie, revalidate: false });
}
