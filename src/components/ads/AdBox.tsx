'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AdImpressionTracker } from './AdImpressionTracker';
import { AdClickLink } from './AdClickLink';

/**
 * Wraps the house-ad markup (label + image) in client state so that if the
 * ad image fails to load (broken URL, deleted asset, network hiccup) the
 * whole slot — label included — collapses to nothing instead of leaving a
 * reserved, empty "Advertisement" box on the page. AdSlot itself already
 * returns null when there's no ad *record*; this handles the case where a
 * record exists but its image doesn't actually render.
 */
export function AdBox({
  adId,
  imageUrl,
  title,
  targetUrl,
  slotClassName,
}: {
  adId: string;
  imageUrl: string;
  title: string;
  targetUrl: string;
  slotClassName: string;
}) {
  const [broken, setBroken] = useState(false);

  if (broken || !imageUrl) return null;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-ink-300">
        Advertisement
      </p>
      {/*
        The sizing classes (aspect-ratio / fixed height from SLOT_SIZES)
        live on this plain div, not on the <a> below. next/image's `fill`
        mode needs every ancestor down to this point to resolve to a real
        height; putting the size on a block-level div and then forcing
        `h-full w-full` on every element in between (AdImpressionTracker,
        AdClickLink) keeps that chain intact. Previously the size classes
        were on the <a> itself with an unstyled div between it and here,
        which collapsed to height 0 and rendered the ad invisible.
      */}
      <div className={`relative w-full overflow-hidden rounded-xl ring-1 ring-ink-100 ${slotClassName}`}>
        <AdImpressionTracker adId={adId}>
          <AdClickLink adId={adId} targetUrl={targetUrl} className="block h-full w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 728px"
              onError={() => setBroken(true)}
            />
          </AdClickLink>
        </AdImpressionTracker>
      </div>
    </div>
  );
}