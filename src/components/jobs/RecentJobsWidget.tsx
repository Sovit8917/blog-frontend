import Link from 'next/link';
import Image from 'next/image';
import { Building2 } from 'lucide-react';
import type { JobCard as JobCardType } from '@/types';
import { getJobCompany } from '@/lib/jobs/format';
import { formatDate } from '@/lib/utils';

/**
 * "Recent Posts"-style sidebar card, matching the layout used across
 * jobcode.in job pages: a vertical list of small thumbnail + title + date
 * rows. Kept intentionally simple/text-forward — this is a discovery rail,
 * not another job-card grid.
 */
export function RecentJobsWidget({
  jobs,
  excludeJobId,
  limit = 7,
}: {
  jobs: JobCardType[];
  excludeJobId?: string;
  limit?: number;
}) {
  const items = jobs.filter((j) => j.id !== excludeJobId).slice(0, limit);
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-brand-600">
        Recent Jobs
      </h3>
      <ul className="divide-y divide-slate-100">
        {items.map((job) => {
          const company = getJobCompany(job);
          return (
            <li key={job.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <Link
                href={`/jobs/${job.slug}`}
                className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-50 ring-1 ring-inset ring-ink-100"
              >
                {company.logoUrl ? (
                  <Image src={company.logoUrl} alt="" fill className="object-contain p-1.5" />
                ) : (
                  <Building2 size={18} className="text-ink-300" />
                )}
              </Link>
              <div className="min-w-0">
                <Link href={`/jobs/${job.slug}`} className="group">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 group-hover:text-brand-600">
                    {job.title}
                  </p>
                </Link>
                <p className="mt-1 truncate text-xs text-ink-500">{company.name}</p>
                {job.publishedAt && (
                  <p className="mt-0.5 text-[11px] text-ink-400">{formatDate(job.publishedAt)}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
