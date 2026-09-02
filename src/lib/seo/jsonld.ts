import { SITE } from './metadata';
import type { Post } from '@/types';

export function postJsonLd(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.seoDescription || undefined,
    image: post.ogImageUrl || post.coverImageUrl || undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${SITE.url}/author/${post.author.username}`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/blog/${post.slug}` },
    keywords: post.tags.map((t) => t.name).join(', ') || undefined,
    articleSection: post.category?.name,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
  };
}

/**
 * ItemList of JobPosting entries — used by SEO landing pages that curate a
 * specific slice of the job board (e.g. /jobs/fresher) so search engines can
 * pick up the listings as rich results without us hand-rolling full
 * JobPosting objects (validThrough/hiringOrganization etc.) per card.
 */
export function jobListJsonLd(jobs: { title: string; slug: string; location?: string | null }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: jobs.map((job, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE.url}/jobs/${job.slug}`,
      name: job.title,
    })),
  };
}

/** FAQPage schema for the FAQ blocks on SEO landing pages like /jobs/fresher. */
export function faqJsonLd(qa: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
