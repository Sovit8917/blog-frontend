import type { Metadata } from 'next';
import { stripMarkdown, truncate } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Karyvio';

interface PostSeoInput {
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  ogImageUrl?: string | null;
  coverImageUrl?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
  publishedAt?: string | null;
  updatedAt?: string | null;
  author?: { name: string } | null;
}

export function buildPostMetadata(post: PostSeoInput): Metadata {
  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription || truncate(post.excerpt || stripMarkdown(post.content || ''), 160);
  const image = post.ogImageUrl || post.coverImageUrl || `${SITE_URL}/og-default.png`;
  const url = post.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    keywords: post.seoKeywords || undefined,
    alternates: { canonical: url },
    robots: post.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      authors: post.author ? [post.author.name] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export function buildListMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
}): Metadata {
  const url = `${SITE_URL}${input.path}`;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      images: input.image ? [{ url: input.image, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: input.title, description: input.description },
  };
}

export const SITE = { url: SITE_URL, name: SITE_NAME };
