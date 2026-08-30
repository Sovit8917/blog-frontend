import { API_BASE } from './client';

export type AnalyticsEventType =
  | 'PAGE_VIEW'
  | 'POST_VIEW'
  | 'AD_IMPRESSION'
  | 'AD_CLICK'
  | 'AFFILIATE_CLICK'
  | 'NEWSLETTER_SIGNUP'
  | 'SEARCH'
  | 'SHARE';

export interface TrackEventInput {
  type: AnalyticsEventType;
  postId?: string;
  jobId?: string;
  /** Share platform for SHARE events, e.g. "whatsapp", "copy_link", "x". */
  channel?: string;
  path?: string;
}

/**
 * Fire-and-forget event tracking (P0 #18 — Share analytics). Uses
 * `navigator.sendBeacon` when available so it survives the page/tab closing
 * right after a share click, falling back to a plain fetch otherwise. Never
 * throws — a dropped analytics ping should never break the UI.
 */
export function trackEvent(input: TrackEventInput) {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify(input);
  const url = `${API_BASE}/analytics/track`;

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
      return;
    }
  } catch {
    // fall through to fetch
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
