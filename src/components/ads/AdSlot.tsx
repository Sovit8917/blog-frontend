import { getAdsForPlacement, getAdsenseSettings } from '@/lib/api';
import type { AdPlacement } from '@/types';
import { AdBox } from './AdBox';
import { GoogleAdUnit } from './GoogleAdUnit';

const SLOT_SIZES: Record<AdPlacement, string> = {
  HEADER: 'h-[90px] max-w-[728px]',
  SIDEBAR: 'aspect-[300/250] max-w-[300px]',
  IN_CONTENT: 'aspect-[16/6] max-w-full',
  FOOTER: 'h-[90px] max-w-[728px]',
  BETWEEN_POSTS: 'aspect-[16/5] max-w-full',
  POPUP: 'aspect-square max-w-[400px]',
};

/**
 * Server-rendered ad slot with a two-tier waterfall:
 *
 *   1. House ad — fetches the ranked-active ad for this placement from
 *      `GET /ads?placement=X`. These are direct-sold/sponsor/affiliate ads,
 *      which almost always pay better per-impression than programmatic, so
 *      they always win when one is active.
 *   2. AdSense fallback — if no house ad is active for the slot (nothing
 *      booked, campaign paused, budget exhausted, etc.), render a Google
 *      AdSense unit instead of leaving unsold, unmonetized empty space.
 *      Publisher ID / client ID / per-placement slot IDs come from the
 *      admin Settings page (`GET /settings?group=monetization`), falling
 *      back to NEXT_PUBLIC_ADSENSE_* env vars if unset there — see
 *      getAdsenseSettings.
 *
 * House-ad impressions are tracked client-side (viewport-based, see
 * AdImpressionTracker) so counts reflect real views, not server renders;
 * clicks POST /ads/:id/click before following the target URL. AdSense
 * handles its own impression/click/revenue tracking on Google's side.
 *
 * Renders nothing only if there's neither a house ad nor an AdSense slot
 * configured for this placement — never show a broken placeholder.
 */
export async function AdSlot({ placement, className = '' }: { placement: AdPlacement; className?: string }) {
  const [ads, adsense] = await Promise.all([
    getAdsForPlacement(placement).catch(() => []),
    getAdsenseSettings(),
  ]);
  const ad = ads[0];

  if (!ad) {
    const adsenseSlot = adsense.slots[placement];
    if (!adsense.clientId || !adsenseSlot) return null;
    return (
      <GoogleAdUnit
        clientId={adsense.clientId}
        slot={adsenseSlot}
        className={`${SLOT_SIZES[placement]} ${className}`}
      />
    );
  }

  return (
    <div className={`mx-auto w-full ${className}`}>
      <AdBox
        adId={ad.id}
        imageUrl={ad.imageUrl}
        title={ad.title}
        targetUrl={ad.targetUrl}
        slotClassName={SLOT_SIZES[placement]}
      />
    </div>
  );
}
