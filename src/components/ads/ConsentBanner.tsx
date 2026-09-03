'use client';

import { useEffect, useState } from 'react';
import { getStoredConsent, setConsent } from '@/lib/ads/consent';

/**
 * Bottom consent banner gating ad personalization/measurement cookies.
 * Rendered site-wide (root layout) but only actually shows once, on the
 * first page view where no stored choice exists yet — see getStoredConsent.
 *
 * Deliberately shown to every visitor rather than gated behind geo-IP
 * detection: this codebase has no geo lookup, and defaulting to "don't
 * show it outside the EU" is the kind of assumption that's easy to get
 * wrong (VPNs, evolving state privacy laws, etc.). Showing it universally
 * is the conservative choice.
 *
 * "Reject" still lets the site work — it only withholds the ad
 * personalization/analytics-cookie consent signal from Google (see
 * lib/ads/consent.ts); it doesn't block AdSense from serving non-personalized
 * ads, which don't require this consent.
 *
 * TODO: once a /privacy page exists, link it here — "Learn more" pointing
 * nowhere is worse than no link at all.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!getStoredConsent());
  }, []);

  if (!visible) return null;

  function choose(ads: 'granted' | 'denied') {
    setConsent({ ads, analytics: ads });
    setVisible(false);
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-100 dark:border-ink-800 bg-white/95 dark:bg-ink-900 px-4 pt-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-relaxed text-ink-600 dark:text-ink-400">
          We use cookies to run ads and measure how the site is used. You can accept or decline —
          the site works either way.
        </p>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <button
            onClick={() => choose('denied')}
            className="flex-1 rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-ink-500 dark:text-ink-400 ring-1 ring-ink-200 dark:ring-ink-700 transition hover:bg-ink-50 dark:hover:bg-ink-800 active:bg-ink-100 dark:active:bg-ink-800 sm:flex-none sm:py-2"
          >
            Decline
          </button>
          <button
            onClick={() => choose('granted')}
            className="flex-1 rounded-lg bg-brand-600 dark:bg-brand-500 px-3.5 py-2.5 text-[13px] font-medium text-white transition hover:bg-brand-700 dark:hover:bg-brand-600 active:bg-brand-700 dark:active:bg-brand-600 sm:flex-none sm:py-2"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
