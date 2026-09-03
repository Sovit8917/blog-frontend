import { getAdsForPlacement, getAdsenseSettings } from '@/lib/api';
import type { AdPlacement } from '@/types';
import { AdBox } from './AdBox';
import { GoogleAdUnit } from './GoogleAdUnit';

// Mobile gets a shorter reserved box than desktop so the slot never eats a
// disproportionate share of a small viewport while it's loading/unfilled.
const SLOT_SIZES: Record<AdPlacement, string> = {
  HEADER: 'h-[50px] sm:h-[90px] max-w-[728px]',
  SIDEBAR: 'aspect-[300/250] max-w-[300px]',
  IN_CONTENT: 'aspect-[16/9] sm:aspect-[16/6] max-w-full',
  FOOTER: 'h-[50px] sm:h-[90px] max-w-[728px]',
  BETWEEN_POSTS: 'aspect-[16/9] sm:aspect-[16/5] max-w-full',
  POPUP: 'aspect-square max-w-[280px] sm:max-w-[400px]',
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
    getAdsForPlacement(placement).catch((err) => {
      // Swallowing this to `[]` is intentional — a broken ads request should
      // never break the page — but doing it silently made a misconfigured
      // NEXT_PUBLIC_API_URL / API prefix / CORS origin indistinguishable
      // from "no ad booked for this slot": every placement on every page
      // would just quietly fall through to the (unfilled) AdSense slot with
      // no error anywhere. Log it so that failure mode is visible in the
      // server logs instead of only showing up as "ads don't appear".
      console.error(`[AdSlot] failed to fetch house ads for placement ${placement}:`, err);
      return [];
    }),
    getAdsenseSettings(),
  ]);
  const ad = ads[0];

  if (!ad) {
    const adsenseSlot = adsense.slots[placement];
    if (!adsense.clientId || !adsenseSlot) return null;
    return (
      <div className={`mx-auto w-full ${className}`}>
        <GoogleAdUnit
          clientId={adsense.clientId}
          slot={adsenseSlot}
          className={SLOT_SIZES[placement]}
        />
      </div>
    );
  }

  if (!ad.imageUrl) return null;

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
