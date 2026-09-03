import { apiFetch, API_BASE } from './client';
import type { AdPlacement, Advertisement, Sponsor, NewsletterSponsorSlot, AffiliateLink } from '@/types';

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

/**
 * GET /affiliate-links?postId=X — active affiliate picks for the "Recommended
 * for you" card on a post. Backend fills any gap under `limit` from the
 * general active pool, so this can come back non-empty even on posts with
 * nothing manually attached.
 */
export function getAffiliateRecommendations(postId: string, limit = 4) {
  return apiFetch<AffiliateLink[]>(`/affiliate-links?postId=${postId}&limit=${limit}`, {
    revalidate: 300,
    tags: [`affiliate-links:${postId}`],
  });
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

export interface SocialLinks {
  twitter: string;
  linkedin: string;
  github: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
}

/**
 * GET /settings?group=social -- Social links as set by the admin in
 * Settings → Social links. Source of truth is the database (`social_links`
 * setting) — no env vars, no endpoint-guessing. If the admin hasn't filled
 * a field in, it comes back as '' and callers should just not render that
 * icon.
 */
export async function getSocialLinks(): Promise<SocialLinks> {
  const settings = await apiFetch<Record<string, any>>('/settings?group=social', {
    revalidate: 300,
    tags: ['settings:social'],
  }).catch(() => ({}) as Record<string, any>);

  const links = settings.social_links || settings || {};

  return {
    twitter: links.twitter || '',
    linkedin: links.linkedin || '',
    github: links.github || '',
    telegram: links.telegram || '',
    whatsapp: links.whatsapp || '',
    instagram: links.instagram || '',
    facebook: links.facebook || '',
  };
}




