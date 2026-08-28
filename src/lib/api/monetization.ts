import { apiFetch, API_BASE } from './client';
import type { AdPlacement, Advertisement, Sponsor } from '@/types';

/**
 * GET /ads?placement=X — active ads for a slot, ranked by priority on the backend.
 * Cached briefly: ad rotation should feel live without hammering the API on every render.
 */
export function getAdsForPlacement(placement: AdPlacement) {
  return apiFetch<Advertisement[]>(`/ads?placement=${placement}`, {
    revalidate: 120,
    tags: [`ads:${placement}`],
  });
}

/** POST /ads/:id/click — fire-and-forget click tracking, called client-side. */
export function recordAdClick(id: string) {
  return apiFetch<void>(`/ads/${id}/click`, { method: 'POST', revalidate: false });
}

/**
 * Affiliate links resolve via a redirect endpoint (GET /go/:slug) that the backend
 * uses to log the click then 302 to the real destination — so the frontend never
 * calls this as JSON, it just points an <a href> at it. See AffiliateLink component.
 */
export function affiliateHref(slug: string) {
  // Was missing the backend's `/api/v1` route prefix (same bug as the old
  // apiFetch base URL) — the link 404'd instead of redirecting.
  return `${API_BASE}/go/${slug}`;
}

/** GET /sponsors — active sponsor roster, e.g. for a "Our partners" strip. */
export function listSponsors() {
  return apiFetch<Sponsor[]>('/sponsors', { revalidate: 3600, tags: ['sponsors'] });
}
