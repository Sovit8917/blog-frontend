import { apiFetch } from './client';

/** GET /seo/posts/:slug — everything generateMetadata() needs, in one call. */
export function getPostSeo(slug: string) {
  return apiFetch<{
    title: string;
    excerpt: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    seoKeywords: string | null;
    ogImageUrl: string | null;
    coverImageUrl: string | null;
    canonicalUrl: string | null;
    noIndex: boolean;
    publishedAt: string | null;
    updatedAt: string;
    author: { name: string; username: string };
  } | null>(`/seo/posts/${slug}`, { revalidate: 300, tags: [`post:${slug}`] });
}
