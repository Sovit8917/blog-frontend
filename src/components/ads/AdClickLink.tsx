'use client';

import { recordAdClick } from '@/lib/api/monetization';

/**
 * The ad's `<a>` must point at `ad.targetUrl` (the advertiser's page), not at
 * the backend's click-tracking endpoint — `POST /ads/:id/click` isn't a
 * redirect, so linking straight to it 404'd/broke navigation entirely. This
 * fires the tracking call in the background on click and lets the browser's
 * default navigation carry on to the real destination.
 */
export function AdClickLink({
  adId,
  targetUrl,
  className,
  children,
}: {
  adId: string;
  targetUrl: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={className}
      onClick={() => {
        recordAdClick(adId).catch(() => {
          // Fire-and-forget: a failed click log should never block navigation.
        });
      }}
    >
      {children}
    </a>
  );
}
