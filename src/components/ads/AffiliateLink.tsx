import { ExternalLink } from 'lucide-react';
import { affiliateHref } from '@/lib/api';

/**
 * Renders an affiliate CTA that points at the backend's redirect+tracking
 * endpoint (`GET /go/:slug`) rather than the merchant URL directly, so every
 * click is logged server-side before the 302. Always disclosed inline per
 * FTC guidance — never a silently-cloaked link.
 */
export function AffiliateLink({
  slug,
  children,
  className = '',
}: {
  slug: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={affiliateHref(slug)}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={`inline-flex items-center gap-1 font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 hover:text-brand-700 ${className}`}
    >
      {children}
      <ExternalLink size={13} className="opacity-60" />
    </a>
  );
}
