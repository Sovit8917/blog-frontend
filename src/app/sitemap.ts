import type { MetadataRoute } from 'next';

/**
 * Delegates to the backend's own GET /sitemap.xml (which already unions posts,
 * categories, tags, jobs with the right lastmod/priority) rather than
 * duplicating that query here — this route just proxies + reformats it into
 * Next's MetadataRoute.Sitemap shape so /sitemap.xml keeps working natively.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? '';
  // Same route-prefix issue as lib/api/client.ts: the backend mounts this
  // under `/api/v1/sitemap.xml`, not `/sitemap.xml` (see setGlobalPrefix in
  // the backend's main.ts).
  const prefix = (process.env.NEXT_PUBLIC_API_PREFIX ?? '/api/v1').replace(/\/+$/, '');
  const entries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${base}${prefix}/sitemap.xml`, { next: { revalidate: 3600 } });
    if (!res.ok) return entries;
    const xml = await res.text();

    const urlRegex = /<loc>(.*?)<\/loc>(?:<lastmod>(.*?)<\/lastmod>)?/g;
    let match;
    while ((match = urlRegex.exec(xml))) {
      const loc = match[1];
      if (!loc) continue;
      entries.push({ url: loc, lastModified: match[2] ? new Date(match[2]) : undefined });
    }
  } catch (err) {
    console.warn('Failed to fetch backend sitemap during build:', err);
  }
  return entries;
}
