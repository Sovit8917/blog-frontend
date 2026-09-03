'use client';

import { useEffect, useRef } from 'react';

/**
 * Wraps an ad slot with IAB-standard viewability detection (>= 50% visible
 * for 1s). The backend has no dedicated impression-tracking endpoint — it
 * counts an impression server-side, best-effort, every time `GET /ads` serves
 * an ad (see `AdsService.getActiveForPlacement`) — so this component doesn't
 * make its own network call (there's nothing to call without touching the
 * backend). It's kept as the hook point for real viewability tracking if a
 * `POST /ads/:id/impression` endpoint is ever added.
 */
export function AdImpressionTracker({
  adId,
  children,
  className = '',
}: {
  adId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      (observedEntries) => {
        const entry = observedEntries[0];
        if (!entry) return;
        if (entry.isIntersecting && !fired.current) {
          timer = setTimeout(() => {
            fired.current = true;
            observer.disconnect();
          }, 1000);
        } else {
          clearTimeout(timer);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [adId]);

  // w-full h-full is required here: this div sits between the sized slot
  // wrapper (see AdBox) and the next/image `fill` element. A plain
  // unstyled div collapses to height 0 (block default is height: auto),
  // which breaks the size chain fill relies on and silently renders the
  // image at 0x0 -- console warns "parent element ... has not been styled
  // to have a set height" and the ad box appears visually empty.
  return (
    <div ref={ref} className={`h-full w-full ${className}`}>
      {children}
    </div>
  );
}