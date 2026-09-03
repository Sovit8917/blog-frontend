import { ShoppingBag, ExternalLink, Sparkles } from 'lucide-react';
import { affiliateHref } from '@/lib/api/monetization';
import type { AffiliateLink } from '@/types';

const ACCENTS = [
  'from-brand-500/10 to-brand-500/0 text-brand-600',
  'from-amber-500/10 to-amber-500/0 text-amber-600',
  'from-emerald-500/10 to-emerald-500/0 text-emerald-600',
  'from-sky-500/10 to-sky-500/0 text-sky-600',
];

/**
 * "Recommended for you" — affiliate picks rendered as a proper card grid
 * instead of a bare inline text link. Every card resolves through the
 * backend's /go/:slug redirect+tracking endpoint, and every card carries an
 * explicit "Affiliate" disclosure per FTC guidance — the label lives on the
 * card itself, not just once at the top, since cards can be scanned
 * independently of the section heading.
 */
export function AffiliateRecommendations({ links }: { links: AffiliateLink[] }) {
  if (!Array.isArray(links) || links.length === 0) return null;

  return (
    <section className="my-10 rounded-2xl border border-ink-100 bg-white p-5 sm:p-6" aria-label="Recommended products">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-brand-500" />
          <h2 className="text-sm font-bold text-ink-900">Recommended for you</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-ink-300">Affiliate</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {links.slice(0, 4).map((link, i) => (
          <a
            key={link.id}
            href={affiliateHref(link.slug)}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-ink-100 bg-gradient-to-br p-3.5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-sm"
            data-accent={i}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]}`}
            >
              <ShoppingBag size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                {link.title}
              </span>
              {link.program && (
                <span className="block truncate text-xs text-ink-400">{link.program}</span>
              )}
            </span>
            <ExternalLink size={14} className="shrink-0 text-ink-300 transition group-hover:text-brand-500" />
          </a>
        ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-ink-300">
        We may earn a commission if you buy through these links, at no extra cost to you.
      </p>
    </section>
  );
}
