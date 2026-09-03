import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Crown } from 'lucide-react';
import type { Sponsor } from '@/types';

const TIER_LABEL: Record<string, string> = {
  PLATINUM: 'Platinum Sponsor',
  GOLD: 'Gold Sponsor',
};

/**
 * Rich cards for the top two sponsor tiers (name, logo, description, CTA) —
 * distinct from `SponsorStrip`'s flat logo row, which fits PARTNER/BRONZE/
 * SILVER-tier "supported by" placements but flattens a Platinum/Gold
 * placement down to the same visual weight as everyone else. Only renders
 * when there's at least one PLATINUM or GOLD sponsor active.
 */
export function PremiumSponsors({ sponsors }: { sponsors: Sponsor[] }) {
  const premium = (sponsors ?? []).filter((s) => s.tier === 'PLATINUM' || s.tier === 'GOLD');
  if (premium.length === 0) return null;

  return (
    <section aria-label="Premium sponsors">
      <div className="mb-4 flex items-center gap-2">
        <Crown size={16} className="text-amber-500" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500">
          Premium sponsors
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {premium.slice(0, 4).map((s) => (
          <Link
            key={s.id}
            href={s.website ?? '#'}
            target={s.website ? '_blank' : undefined}
            rel={s.website ? 'noopener noreferrer sponsored' : undefined}
            className="group flex items-start gap-4 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/70 via-white to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-ink-100">
              {s.logoUrl ? (
                <Image src={s.logoUrl} alt={s.name} fill className="object-contain p-1.5" />
              ) : (
                <span className="text-base font-bold text-ink-700">{s.name.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                {TIER_LABEL[s.tier] ?? 'Sponsor'}
              </span>
              <h3 className="mt-1.5 truncate text-sm font-bold text-ink-900">{s.name}</h3>
              {s.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-500">
                  {s.description}
                </p>
              )}
            </div>
            <ArrowUpRight
              size={16}
              className="shrink-0 text-ink-300 transition group-hover:text-amber-600"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
