import { NextResponse } from "next/server";
import { getAdsenseSettings } from "@/lib/api";

/**
 * Serves /ads.txt, which AdSense (and other programmatic buyers) crawl to
 * verify this domain is authorized to sell inventory under the given
 * publisher ID. Missing/incorrect ads.txt is one of the most common reasons
 * sites get "limited ads" or reduced fill from AdSense, so this is generated
 * from the same admin-configurable settings as the rest of the AdSense setup
 * (see getAdsenseSettings) rather than left as a static file someone forgets
 * to update when the publisher ID changes.
 */
export async function GET() {
  const { publisherId } = await getAdsenseSettings();
  const lines = publisherId
    ? [`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`]
    : [];

  return new NextResponse(lines.join("\n") + (lines.length ? "\n" : ""), {
    headers: { "Content-Type": "text/plain" },
  });
}
