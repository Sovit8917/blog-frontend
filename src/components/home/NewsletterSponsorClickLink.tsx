'use client';

import { recordNewsletterSponsorClick } from '@/lib/api/monetization';

/** Same pattern as AdClickLink: track in the background, let navigation proceed to the real URL. */
export function NewsletterSponsorClickLink({
  slotId,
  url,
  className,
  children,
}: {
  slotId: string;
  url: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className={className}
      onClick={() => {
        recordNewsletterSponsorClick(slotId).catch(() => {
          // Fire-and-forget: a failed click log should never block navigation.
        });
      }}
    >
      {children}
    </a>
  );
}
