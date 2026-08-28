import Image from 'next/image';
import { getAdsForPlacement } from '@/lib/api';
import type { AdPlacement } from '@/types';
import { AdImpressionTracker } from './AdImpressionTracker';
import { AdClickLink } from './AdClickLink';

const SLOT_SIZES: Record<AdPlacement, string> = {
  HEADER: 'h-[90px] max-w-[728px]',
  SIDEBAR: 'aspect-[300/250] max-w-[300px]',
  IN_CONTENT: 'aspect-[16/6] max-w-full',
  FOOTER: 'h-[90px] max-w-[728px]',
  BETWEEN_POSTS: 'aspect-[16/5] max-w-full',
  POPUP: 'aspect-square max-w-[400px]',
};

/**
 * Server-rendered ad slot: fetches the ranked-active ad for a placement from
 * `GET /ads?placement=X` and renders it. Impressions are tracked client-side
 * (viewport-based, see AdImpressionTracker) so counts reflect real views, not
 * server renders; clicks POST /ads/:id/click before following the target URL.
 *
 * Silently renders nothing if no ad is active for the slot — never show a
 * broken placeholder to real visitors.
 */
export async function AdSlot({ placement, className = '' }: { placement: AdPlacement; className?: string }) {
  const ads = await getAdsForPlacement(placement).catch(() => []);
  const ad = ads[0];
  if (!ad) return null;

  return (
    <div className={`mx-auto w-full ${className}`}>
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-wider text-ink-300">
        Advertisement
      </p>
      <AdImpressionTracker adId={ad.id}>
        <AdClickLink
          adId={ad.id}
          targetUrl={ad.targetUrl}
          className={`relative block w-full overflow-hidden rounded-xl ring-1 ring-ink-100 ${SLOT_SIZES[placement]}`}
        >
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 728px"
          />
        </AdClickLink>
      </AdImpressionTracker>
    </div>
  );
}
