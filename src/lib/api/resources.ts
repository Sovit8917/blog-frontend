import { apiFetch, qs } from './client';
import type { DeveloperResource, ListDeveloperResourcesParams, OffsetPage, UnifiedSearchResult } from '@/types';

/**
 * GET /developer-resources — the curated catalog of tools, libraries,
 * tutorials, courses, docs, and communities. Distinct from `/skills`
 * (`lib/api/skills.ts`), which is the tag-like technology list jobs are
 * filtered by; this is editorial content someone on the team picked and
 * ordered, closer in spirit to the Career Content hub than to a filter.
 */
export function listDeveloperResources(params: ListDeveloperResourcesParams = {}) {
  return apiFetch<OffsetPage<DeveloperResource>>(`/developer-resources${qs(params as Record<string, any>)}`, {
    revalidate: 300,
    tags: ['developer-resources'],
  });
}

/**
 * GET /developer-resources/by-slug/:slug — public resource detail, including
 * its editorially-linked jobs (P1 Resource -> Job linking, DeveloperResource.linkedJobs).
 */
export function getDeveloperResourceBySlug(slug: string) {
  return apiFetch<DeveloperResource>(`/developer-resources/by-slug/${slug}`, {
    revalidate: 120,
    tags: ['developer-resources', `developer-resource:${slug}`],
  });
}

/**
 * POST /developer-resources/:id/click — fire-and-forget outbound click
 * tracking, called right before navigating to `resource.url`. Never blocks
 * the navigation and never surfaces an error to the visitor.
 */
export function recordResourceClick(id: string) {
  return apiFetch<void>(`/developer-resources/${id}/click`, { method: 'POST', revalidate: false }).catch(() => {});
}

/**
 * GET /search — the unified, ecosystem-wide search backing `/search`.
 * Returns a shallow slice of every pillar (articles, jobs, companies,
 * skills, developer resources, authors) in one round trip rather than the
 * five separate calls the page used to make.
 */
export function unifiedSearch(query: string, limit = 5) {
  const q = query.trim();
  if (!q) {
    return Promise.resolve<UnifiedSearchResult>({
      query: '',
      posts: [],
      jobs: [],
      companies: [],
      skills: [],
      developerResources: [],
      authors: [],
    });
  }
  return apiFetch<UnifiedSearchResult>(`/search${qs({ q, limit })}`, {
    revalidate: 30,
    tags: ['search'],
  });
}
