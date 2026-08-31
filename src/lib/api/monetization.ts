import { apiFetch, API_BASE } from './client';
import type { AdPlacement, Advertisement, Sponsor, NewsletterSponsorSlot } from '@/types';

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

/** GET /newsletter/sponsor-slot/current — the upcoming booked newsletter sponsor, if any. */
export function getCurrentNewsletterSponsorSlot() {
  return apiFetch<NewsletterSponsorSlot | null>('/newsletter/sponsor-slot/current', {
    revalidate: 300,
    tags: ['newsletter-sponsor-slot'],
  });
}

/** POST /newsletter/sponsor-slot/:id/click — fire-and-forget click tracking. */
export function recordNewsletterSponsorClick(id: string) {
  return apiFetch<void>(`/newsletter/sponsor-slot/${id}/click`, { method: 'POST', revalidate: false });
}

export interface AdsenseSettings {
  publisherId: string;
  clientId: string;
  slots: Partial<Record<AdPlacement, string>>;
}

/**
 * GET /settings?group=monetization -- AdSense config as set in the admin
 * Settings page. This is the source of truth when an admin has configured it
 * there; NEXT_PUBLIC_ADSENSE_* env vars remain a deploy-time fallback for
 * anyone who hasn't touched the admin UI (see getAdsenseSettings callers).
 * Cached briefly since this rarely changes and every page load would
 * otherwise cost an extra request.
 */
export async function getAdsenseSettings(): Promise<AdsenseSettings> {
  const settings = await apiFetch<Record<string, any>>('/settings?group=monetization', {
    revalidate: 300,
    tags: ['settings:monetization'],
  }).catch(() => ({}) as Record<string, any>);

  return {
    publisherId: settings.adsense_publisher_id || process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '',
    clientId: settings.adsense_client_id || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
    slots: {
      HEADER: settings.adsense_slots?.HEADER || process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER || '',
      SIDEBAR: settings.adsense_slots?.SIDEBAR || process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
      IN_CONTENT: settings.adsense_slots?.IN_CONTENT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT || '',
      FOOTER: settings.adsense_slots?.FOOTER || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || '',
      BETWEEN_POSTS:
        settings.adsense_slots?.BETWEEN_POSTS || process.env.NEXT_PUBLIC_ADSENSE_SLOT_BETWEEN_POSTS || '',
    },
  };
}
