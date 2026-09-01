'use client';

import { useEffect, useId, useRef, useState } from 'react';

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
  // AdSense reserves layout space via `min-height` on the <ins> the moment
  // it's pushed, even when the request ends up unfilled (no approved ads
  // for this slot yet, blocked by an ad blocker, etc). Left unchecked that
  // leaves a big blank "Advertisement" box on the page. So: assume filled
  // optimistically, then check the actual rendered height shortly after —
  // an unfilled AdSense unit collapses itself to 0px, which is our signal
  // to hide the whole slot (including the label) instead of showing empty
  // reserved space.
  const [filled, setFilled] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    if (!pushed.current) {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushed.current = true;
      } catch {
        // adsbygoogle script may not have loaded yet (blocked by an ad
        // blocker, slow network, etc.) — fail silently, never break the page.
        setFilled(false);
        return;
      }
    }

    const timer = setTimeout(() => {
      if (insRef.current && insRef.current.clientHeight === 0) {
        setFilled(false);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [clientId, slot]);

  if (!clientId || !filled) return null;

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
