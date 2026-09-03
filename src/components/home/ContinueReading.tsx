import Link from 'next/link';
import Image from 'next/image';
import { RotateCcw } from 'lucide-react';
import type { ReadingHistoryEntry } from '@/types';

/**
 * Retention hook for returning, signed-in visitors: surfaces articles they
 * started but didn't finish (progressPct < 90) so the homepage gives them
 * a reason to pick back up instead of just showing them things they've
 * already read to completion.
 */
export function ContinueReading({ entries }: { entries: ReadingHistoryEntry[] }) {
  const inProgress = entries.filter((e) => e.progressPct > 5 && e.progressPct < 90).slice(0, 3);
  if (inProgress.length === 0) return null;

  return (
    <section className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <RotateCcw size={15} className="text-brand-600 dark:text-brand-400" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700 dark:text-ink-300">Continue reading</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {inProgress.map((entry) => (
          <Link
            key={entry.id}
            href={`/blog/${entry.post.slug}`}
            className="group flex gap-3 rounded-xl border border-ink-100 dark:border-ink-800 p-3 transition hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-sm"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800">
              {entry.post.coverImageUrl ? (
                <Image src={entry.post.coverImageUrl} alt={entry.post.title} fill className="object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-bold text-ink-400 dark:text-ink-500">
                  {entry.post.title[0]}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 dark:text-ink-100 transition group-hover:text-brand-600 dark:group-hover:text-brand-400">
                {entry.post.title}
              </h3>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${Math.min(100, entry.progressPct)}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] font-medium text-ink-400 dark:text-ink-500">{entry.progressPct}% done</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
