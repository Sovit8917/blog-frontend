import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo/metadata';

/**
 * Delegates to the backend's own GET /sitemap.xml (which already unions posts,
 * categories, tags, jobs with the right lastmod/priority) rather than
 * duplicating that query here — this route just proxies + reformats it into
 * Next's MetadataRoute.Sitemap shape so /sitemap.xml keeps working natively.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? '';
  const prefix = (process.env.NEXT_PUBLIC_API_PREFIX ?? '/api/v1').replace(/\/+$/, '');

  try {
    const res = await fetch(`${base}${prefix}/sitemap.xml`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch sitemap: ${res.status} ${res.statusText}`);
    }
    const xml = await res.text();

    const entries: MetadataRoute.Sitemap = [];
    const urlRegex = /<loc>(.*?)<\/loc>(?:<lastmod>(.*?)<\/lastmod>)?/g;
    let match;
    while ((match = urlRegex.exec(xml))) {
      const loc = match[1];
      if (!loc) continue;
      entries.push({ url: loc, lastModified: match[2] ? new Date(match[2]) : undefined });
    }
    return entries;
  } catch (error) {
    console.warn('[sitemap] Failed to fetch sitemap from backend, returning fallback routes:', error);
    // Fallback static routes so build doesn't fail when backend is offline
    const baseUrl = SITE.url || 'http://localhost:3000';
    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/blog`, lastModified: new Date() },
      { url: `${baseUrl}/jobs`, lastModified: new Date() },
      { url: `${baseUrl}/categories`, lastModified: new Date() },
      { url: `${baseUrl}/tags`, lastModified: new Date() },
    ];
  }
}

