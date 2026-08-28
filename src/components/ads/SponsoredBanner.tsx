import Image from 'next/image';
import type { SponsoredContent } from '@/types';

/** Disclosure banner shown at the top of sponsored posts — required, not optional. */
export function SponsoredBanner({ sponsored }: { sponsored: SponsoredContent }) {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
      {sponsored.sponsor.logoUrl && (
        <Image
          src={sponsored.sponsor.logoUrl}
          alt={sponsored.sponsor.name}
          width={36}
          height={36}
          className="rounded-md object-contain"
        />
      )}
      <p className="text-sm text-amber-900">
        <span className="font-semibold">Sponsored by {sponsored.sponsor.name}.</span>{' '}
        {sponsored.disclosure}
      </p>
    </div>
  );
}
