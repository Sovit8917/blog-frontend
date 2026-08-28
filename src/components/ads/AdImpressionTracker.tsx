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
export function AdImpressionTracker({ adId, children }: { adId: string; children: React.ReactNode }) {
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

  return <div ref={ref}>{children}</div>;
}
