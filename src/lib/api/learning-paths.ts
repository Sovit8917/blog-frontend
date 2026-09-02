import { apiFetch, qs } from './client';
import type { LearningPath, ListLearningPathsParams, OffsetPage } from '@/types';

/**
 * GET /learning-paths — curated, ordered "playlists" through existing
 * Developer Resources (e.g. "Become a React Developer"). Public, no login.
 */
export function listLearningPaths(params: ListLearningPathsParams = {}) {
  return apiFetch<OffsetPage<LearningPath>>(`/learning-paths${qs(params as Record<string, any>)}`, {
    revalidate: 300,
    tags: ['learning-paths'],
  });
}

/** GET /learning-paths/by-slug/:slug — public path detail with ordered steps. */
export function getLearningPathBySlug(slug: string) {
  return apiFetch<LearningPath>(`/learning-paths/by-slug/${slug}`, {
    revalidate: 120,
    tags: ['learning-paths', `learning-path:${slug}`],
  });
}
