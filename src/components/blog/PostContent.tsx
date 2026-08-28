import { MarkdownContent } from '@/components/shared/MarkdownContent';

/**
 * Renders the post's markdown body with a typography scale tuned for long-form
 * reading (see tailwind.config `typography` overrides): generous line-height,
 * a 70ch measure, and heading ids for the table-of-contents / deep links.
 *
 * Thin wrapper around the shared MarkdownContent renderer (also used by job
 * descriptions) so posts and job postings render tables/lists identically.
 */
export function PostContent({ content }: { content: string }) {
  return <MarkdownContent content={content} slugHeadings />;
}
