
const STORAGE_KEY = 'consent_prefs_v1';

export type ConsentChoice = 'granted' | 'denied';

export interface ConsentPrefs {
  ads: ConsentChoice;
  analytics: ConsentChoice;
  /** ISO timestamp of when the visitor made this choice — useful if you ever need to re-prompt after a policy change. */
  decidedAt: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google's Consent Mode v2 gtag signal. AdSense (and any other Google tag on
 * the page) reads this to decide whether it's allowed to use
 * cookies/localStorage for ad personalization/measurement. This must exist
 * — with an explicit 'denied' default — before the AdSense script tag loads,
 * which is why GoogleAdSenseScript renders this ahead of the adsbygoogle.js
 * tag with `strategy="beforeInteractive"`.
 *
 * Denying by default and only flipping to 'granted' after an explicit choice
 * is the "safe" default consent-mode setup: visitors who never see or
 * interact with the banner (e.g. JS disabled, banner dismissed by clicking
 * elsewhere) stay opted out rather than defaulting to tracked.
 */
export function consentModeDefaultSnippet(): string {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('consent', 'default', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied',
      'wait_for_update': 500
    });
  `;
}

export function getStoredConsent(): ConsentPrefs | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentPrefs) : null;
  } catch {
    // localStorage unavailable (private mode, blocked) — treat as no decision yet.
    return null;
  }
}

/** Persists the choice and immediately updates the live gtag consent signal so AdSense picks it up without a page reload. */
export function setConsent(prefs: Pick<ConsentPrefs, 'ads' | 'analytics'>) {
  const full: ConsentPrefs = { ...prefs, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  } catch {
    // Best-effort — if storage is blocked, the consent still applies for this page view via gtag below.
  }
  window.gtag?.('consent', 'update', {
    ad_storage: prefs.ads,
    ad_user_data: prefs.ads,
    ad_personalization: prefs.ads,
    analytics_storage: prefs.analytics,
  });
}