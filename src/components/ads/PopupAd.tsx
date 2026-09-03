'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';
import { getAdsForPlacement } from '@/lib/api/monetization';
import type { Advertisement } from '@/types';
import { AdImpressionTracker } from './AdImpressionTracker';
import { AdClickLink } from './AdClickLink';

const SESSION_KEY = 'popup_ad_dismissed_v1';
const SHOW_DELAY_MS = 4000;

/**
 * The POPUP placement had no implementation at all — `AdSlot` is a
 * server component built around always-rendered inline slots (header,
 * sidebar, in-content, footer, between-posts) and doesn't fit a modal
 * that should (a) not block first paint, (b) only appear once per
 * session, and (c) be dismissible. This is the client-side counterpart
 * for that one placement, mounted once in the root layout.
 *
 * House ads only (no AdSense fallback) — an AdSense interstitial needs
 * Google's own auto-ads/vignette setup, not a slot id, so mixing it into
 * this component would just be a broken no-op most of the time.
 */
export function PopupAd() {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      // sessionStorage unavailable (private mode, blocked) — treat as not dismissed.
    }
    if (dismissed) return;

    let cancelled = false;
    getAdsForPlacement('POPUP')
      .then((ads) => {
        if (cancelled || !ads[0]?.imageUrl) return;
        setAd(ads[0]);
      })
      .catch((err) => {
        console.error('[PopupAd] failed to fetch house ads for placement POPUP:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ad) return;
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [ad]);

  // Esc closes it too — a modal that only responds to clicking outside or
  // the tiny corner button is a worse experience than it needs to be.
  useEffect(() => {
    if (!visible) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function dismiss() {
    setClosing(true);
    // Let the fade/scale-out transition play before unmounting.
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 180);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Best-effort — worst case it can show again next page view this session.
    }
  }

  if (!ad || !visible || broken || !ad.imageUrl) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm transition-opacity duration-200 ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Advertisement"
      onClick={dismiss}
    >
      <div
        className={`relative w-full max-w-[420px] max-h-[85vh] overflow-hidden rounded-2xl bg-white dark:bg-ink-900 shadow-2xl ring-1 ring-black/5 transition-all duration-200 ${
          closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Close advertisement"
          className="absolute right-2.5 top-2.5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 dark:bg-ink-900 text-ink-600 dark:text-ink-400 shadow-md ring-1 ring-ink-200 dark:ring-ink-700 backdrop-blur transition hover:scale-105 hover:bg-white dark:hover:bg-ink-900 active:scale-95"
        >
          <X size={18} />
        </button>

        <AdImpressionTracker adId={ad.id}>
          <AdClickLink adId={ad.id} targetUrl={ad.targetUrl} className="group block">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-50 dark:bg-ink-900">
              <Image
                src={ad.imageUrl}
                alt={ad.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
                sizes="420px"
                onError={() => setBroken(true)}
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                Advertisement
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink-900 dark:text-ink-100">{ad.title}</p>
                {ad.advertiser && (
                  <p className="truncate text-xs text-ink-400 dark:text-ink-500">{ad.advertiser}</p>
                )}
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 dark:bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition group-hover:bg-brand-700 dark:group-hover:bg-brand-600">
                Learn more
                <ArrowRight size={13} />
              </span>
            </div>
          </AdClickLink>
        </AdImpressionTracker>
      </div>
    </div>
  );
}
