'use client';

import { useEffect, useId, useRef } from 'react';

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
 * Pushes to window.adsbygoogle on mount, and re-pushes if `slot` changes
 * (e.g. client-side navigation between posts) since each <ins> needs its
 * own (single) push call to actually render.
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
  const pushed = useRef(false);
  const uid = useId();

  useEffect(() => {
    if (!clientId || pushed.current) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // adsbygoogle script may not have loaded yet (blocked by an ad
      // blocker, slow network, etc.) — fail silently, never break the page.
    }
  }, [clientId, slot]);

  if (!clientId) return null;

  return (
    <div className={`mx-auto w-full text-center ${className}`}>
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-ink-300">
        Advertisement
      </p>
      <ins
        key={uid}
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}
