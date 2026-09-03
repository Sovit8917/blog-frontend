import { getCurrentNewsletterSponsorSlot } from '@/lib/api';
import { NewsletterSponsorClickLink } from './NewsletterSponsorClickLink';

/**
 * Renders the booked sponsor for the next newsletter issue, if any — a
 * one-line disclosure + link, matching the tone of SponsoredBanner but
 * scoped to the newsletter placement rather than a post.
 */
export async function NewsletterSponsorLine() {
  const slot = await getCurrentNewsletterSponsorSlot().catch(() => null);
  if (!slot) return null;

  return (
    <div className="mx-auto mt-4 flex max-w-sm items-center justify-center gap-2 rounded-lg bg-white/10 dark:bg-ink-900 px-3 py-2 text-xs text-ink-200 dark:text-ink-700">
      <span className="font-semibold text-white">Sponsored by {slot.sponsor.name}:</span>
      <NewsletterSponsorClickLink
        slotId={slot.id}
        url={slot.url}
        className="underline decoration-ink-400 dark:decoration-ink-500 underline-offset-2 hover:text-white"
      >
        {slot.headline}
      </NewsletterSponsorClickLink>
    </div>
  );
}
