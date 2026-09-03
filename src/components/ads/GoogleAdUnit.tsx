'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

/**
 * A single AdSense display unit. `slot` is the ad-unit ID from the AdSense
 * dashboard (Ads > By ad unit), one per placement — HEADER, SIDEBAR, etc.
 * should each get their own so AdSense can report and optimize per-slot.
 * `clientId` is passed in by the caller (AdSlot) rather than read from env
 * here, since it may come from the admin Settings page at request time —
 * see getAdsenseSettings.
 *
 * Pushes to window.adsbygoogle on mount, and re-pushes if `clientId` or `slot`
 * changes (e.g. client-side navigation between posts) with fresh ins tracking.
 */
export function GoogleAdUnit({
  clientId,
  slot,
  format = 'auto',
  fullWidthResponsive = true,
  className = '',
  style,
}: {
  clientId: string;
  slot: string;
  format?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const insRef = useRef<HTMLModElement>(null);
  // Three-state lifecycle:
  //  - 'loading': request just went out, fill status unknown yet. Shown with minimal space.
  //  - 'filled': AdSense actually rendered something with real height — show full dimensions.
  //  - 'unfilled': confirmed no-fill, blocked, or errored — collapses to 0 height / null.
  const [status, setStatus] = useState<'loading' | 'filled' | 'unfilled'>('loading');

  useEffect(() => {
    if (!clientId || !slot) {
      setStatus('unfilled');
      return;
    }

    setStatus('loading');

    // Attempt to push to AdSense for this unit
    let pushSucceeded = false;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushSucceeded = true;
    } catch {
      // adsbygoogle script may not have loaded yet or ad blocker active
      setStatus('unfilled');
      return;
    }

    if (!pushSucceeded) return;

    let cancelled = false;

    // Monitor AdSense's own fill signal. `data-ad-status` is the attribute
    // Google's script sets once a request actually resolves — "filled" only
    // once a creative is really rendered inside the <ins>, "unfilled" for a
    // confirmed no-fill/blocked/error response. We used to also treat "the
    // iframe already has height" as a proxy for "filled", but AdSense (and
    // most ad blockers that let the script through but still strip the
    // creative) allocate a same-sized placeholder iframe immediately, before
    // the request resolves — so that heuristic reported "filled" for ads
    // that never actually served anything, leaving a blank reserved box with
    // an "Advertisement" label and nothing inside it. Only data-ad-status is
    // trustworthy here.
    const checkFillStatus = () => {
      if (cancelled || !insRef.current) return;

      const adStatus = insRef.current.getAttribute('data-ad-status');
      if (adStatus === 'unfilled') {
        cancelled = true;
        clearInterval(pollInterval);
        setStatus('unfilled');
        return;
      }

      if (adStatus === 'filled') {
        cancelled = true;
        clearInterval(pollInterval);
        setStatus('filled');
        return;
      }
    };

    const pollInterval = setInterval(checkFillStatus, 200);

    // Hard cap: if AdSense does not confirm fill within 3.5s, collapse completely to avoid blank space
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if (!cancelled) {
        const adStatus = insRef.current?.getAttribute('data-ad-status');
        if (adStatus === 'filled') {
          setStatus('filled');
        } else {
          setStatus('unfilled');
        }
      }
    }, 3500);

    return () => {
      cancelled = true;
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [clientId, slot]);

  if (!clientId || !slot || status === 'unfilled') return null;

  // Use a unique key combining clientId and slot on the ins element to guarantee
  // a clean DOM node and reliable re-push whenever slot or clientId changes.
  const adUnitKey = `${clientId}-${slot}`;

  return (
    <div
      className={`mx-auto w-full text-center transition-all duration-200 ${
        status === 'filled' ? className : 'h-auto min-h-0'
      }`}
    >
      {status === 'filled' && (
        <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-ink-300">
          Advertisement
        </p>
      )}
      {status === 'loading' && (
        <div className="mx-auto my-1 h-[6px] w-full max-w-[80px] animate-pulse rounded-full bg-ink-100" />
      )}
      <div
        style={
          status === 'loading'
            ? { height: 0, maxHeight: 0, overflow: 'hidden', opacity: 0 }
            : undefined
        }
      >
        <ins
          key={adUnitKey}
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', ...style }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
}
