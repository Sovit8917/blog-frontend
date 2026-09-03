import Image from 'next/image';
import Link from 'next/link';
import type { Sponsor } from '@/types';

/**
 * "Our partners" strip — the `GET /sponsors` endpoint and `Sponsor` type
 * already existed on both ends but nothing ever rendered it. Sponsors are
 * a monetization surface distinct from display ads (longer-term brand
 * placements vs. per-impression ad inventory), so they get their own
 * lightweight logo strip rather than being folded into AdSlot.
 */
export function SponsorStrip({ sponsors }: { sponsors: Sponsor[] }) {
  // Platinum/Gold get the richer PremiumSponsors cards elsewhere on the page —
  // keep this strip for the lighter-weight Silver/Bronze/Partner tiers so a
  // sponsor isn't shown twice at two different visual weights.
  const rest = (sponsors ?? []).filter((s) => s.tier !== 'PLATINUM' && s.tier !== 'GOLD');
  if (rest.length === 0) return null;

  return (
    <section className="rounded-2xl border border-ink-100 bg-ink-50/40 px-5 py-6 sm:px-6">
      <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-ink-400">
        Supported by
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
        {rest.slice(0, 8).map((s) => (
          <Link
            key={s.id}
            href={s.website ?? '#'}
            target={s.website ? '_blank' : undefined}
            rel={s.website ? 'noopener noreferrer sponsored' : undefined}
            className="flex items-center gap-2 grayscale opacity-70 transition hover:opacity-100 hover:grayscale-0"
            title={s.name}
          >
            {s.logoUrl ? (
              <div className="relative h-7 w-24">
                <Image src={s.logoUrl} alt={s.name} fill className="object-contain" />
              </div>
            ) : (
              <span className="text-sm font-semibold text-ink-600">{s.name}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
