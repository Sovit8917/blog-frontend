import { apiFetch, qs } from './client';
import type { Company, ListCompaniesParams, OffsetPage } from '@/types';

/** GET /companies — offset-paginated directory. */
export function listCompanies(params: ListCompaniesParams = {}) {
  return apiFetch<OffsetPage<Company>>(`/companies${qs(params as Record<string, any>)}`, {
    revalidate: 300,
    tags: ['companies'],
  });
}

/** GET /companies/:slug — company profile + its open jobs. */
export function getCompanyBySlug(slug: string) {
  return apiFetch<Company>(`/companies/${slug}`, {
    revalidate: 120,
    tags: ['companies', `company:${slug}`],
  });
}
