import Script from 'next/script';
import { getAdsenseSettings } from '@/lib/api';
import { consentModeDefaultSnippet } from '@/lib/ads/consent';

/**
 * Loads the AdSense loader script once, site-wide (required for both manual
 * ad units and Auto Ads). Renders nothing if no AdSense client ID is
 * configured -- either via the admin Settings page (preferred, see
 * getAdsenseSettings) or NEXT_PUBLIC_ADSENSE_CLIENT_ID -- so local/dev/staging
 * environments without an approved AdSense account don't ship a broken
 * script tag.
 *
 * Two scripts, in a specific order:
 *   1. The Consent Mode v2 default snippet (`beforeInteractive`, so it runs
 *      before anything else on the page) -- sets ad/analytics storage to
 *      'denied' until the visitor makes a choice in ConsentBanner. AdSense
 *      reads this signal itself; without it, AdSense would use
 *      personalization/measurement cookies before consent is given.
 *   2. The AdSense loader (`afterInteractive`), which now launches already
 *      respecting that default.
 *
 * Auto Ads (Google's algorithmic placement on top of these manual units) is
 * a per-site toggle in the AdSense dashboard, not a code flag -- turn it on
 * there if you want it. Left off by default there since Auto Ads tends to
 * visually clash with the hand-placed house-ad slots below.
 */
export async function GoogleAdSenseScript() {
  const { clientId } = await getAdsenseSettings();
  if (!clientId) return null;

  return (
    <>
      <Script
        id="consent-mode-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: consentModeDefaultSnippet() }}
      />
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}