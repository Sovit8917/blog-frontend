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
  const pushedRef = useRef(false);
  const [status, setStatus] = useState<'loading' | 'filled' | 'unfilled'>('loading');

  useEffect(() => {
    pushedRef.current = false;
  }, [clientId, slot]);

  useEffect(() => {
    if (!clientId || !slot) {
      setStatus('unfilled');
      return;
    }

    let cancelled = false;
    let pollInterval: NodeJS.Timeout | null = null;
    let timeout: NodeJS.Timeout | null = null;

    const tryPush = () => {
      if (cancelled || !insRef.current || pushedRef.current) return;

      // Google AdSense throws "TagError: adsbygoogle.push() error: No slot size for availableWidth=0"
      // if the container is hidden or has 0 offsetWidth/clientWidth at push time.
      const width = insRef.current.offsetWidth || insRef.current.parentElement?.offsetWidth || 0;
      if (width === 0) {
        // Wait until next animation frame / layout pass
        requestAnimationFrame(tryPush);
        return;
      }

      // Check if this ins element already has ad content or was already processed
      if (
        insRef.current.getAttribute('data-adsbygoogle-status') ||
        insRef.current.innerHTML.trim() !== ''
      ) {
        pushedRef.current = true;
        return;
      }

      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushedRef.current = true;
      } catch (e) {
        // Catch Adsbygoogle TagError or adblocker errors gracefully without crashing the UI
        console.warn('AdSense push error suppressed:', e);
        setStatus('unfilled');
        return;
      }

      // Monitor AdSense's fill signal
      const checkFillStatus = () => {
        if (cancelled || !insRef.current) return;

        const adStatus = insRef.current.getAttribute('data-ad-status');
        if (adStatus === 'unfilled') {
          cancelled = true;
          if (pollInterval) clearInterval(pollInterval);
          setStatus('unfilled');
          return;
        }

        if (adStatus === 'filled') {
          cancelled = true;
          if (pollInterval) clearInterval(pollInterval);
          setStatus('filled');
          return;
        }
      };

      pollInterval = setInterval(checkFillStatus, 200);

      // Timeout fallback
      timeout = setTimeout(() => {
        if (pollInterval) clearInterval(pollInterval);
        if (!cancelled) {
          const adStatus = insRef.current?.getAttribute('data-ad-status');
          if (adStatus === 'filled') {
            setStatus('filled');
          } else {
            setStatus('unfilled');
          }
        }
      }, 3500);
    };

    // Delay initial push attempt slightly to allow React layout and CSS rendering
    const rafId = requestAnimationFrame(tryPush);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (pollInterval) clearInterval(pollInterval);
      if (timeout) clearTimeout(timeout);
    };
  }, [clientId, slot]);

  if (!clientId || !slot || status === 'unfilled') return null;

  const adUnitKey = `${clientId}-${slot}`;

  return (
    <div
      className={`mx-auto w-full text-center transition-all duration-200 ${
        status === 'filled' ? className : 'h-auto min-h-0'
      }`}
    >
      {status === 'filled' && (
        <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-ink-300 dark:text-ink-600">
          Advertisement
        </p>
      )}
      {status === 'loading' && (
        <div className="mx-auto my-1 h-[6px] w-full max-w-[80px] animate-pulse rounded-full bg-ink-100 dark:bg-ink-800" />
      )}
      <div
        className="w-full"
        style={
          status === 'loading'
            ? { minHeight: '1px', opacity: 0 }
            : undefined
        }
      >
        <ins
          key={adUnitKey}
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '250px', ...style }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
}
