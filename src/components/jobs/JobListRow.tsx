import Link from 'next/link';
import Image from 'next/image';
import { BadgeCheck, Building2, ArrowUpRight } from 'lucide-react';
import type { JobCard as JobCardType } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, stripMarkdown, truncate } from '@/lib/utils';
import { getJobCompany } from '@/lib/jobs/format';

/**
 * One row in the jobs list, styled like a jobcode.in-style job-board post:
 * a wide company/banner image on the left, tag badges + title + a short
 * excerpt + author/date on the right, and a black "Apply Now" pill. This is
 * the desktop/tablet AND mobile layout — unlike JobGrid it doesn't switch
 * to a table, since the reference layout is the same shape at every size.
 */
export function JobListRow({ job }: { job: JobCardType }) {
  const company = getJobCompany(job);
  const excerpt = truncate(stripMarkdown(job.description), 180);
  const banner = job.images?.[0] || company.logoUrl;

  return (
    <article className="flex flex-col gap-4 border-b border-slate-100 py-6 first:pt-0 last:border-0 last:pb-0 sm:flex-row">
      <Link
        href={`/jobs/${job.slug}`}
        className="relative flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:h-32 sm:w-48"
      >
        {banner ? (
          <Image
            src={banner}
            alt={company.name}
            fill
            className={company.logoUrl === banner ? 'object-contain p-6' : 'object-cover'}
            sizes="(max-width: 640px) 100vw, 192px"
          />
        ) : (
          <Building2 size={28} className="text-ink-300" />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {job.isFeatured && (
            <span className="rounded bg-ink-900 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
              Featured
            </span>
          )}
          {job.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-ink-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/jobs/${job.slug}`} className="group">
          <h2 className="text-lg font-bold leading-snug text-ink-950 group-hover:text-brand-600 sm:text-xl">
            {job.title}
          </h2>
        </Link>

        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink-600">
          {company.name}
          {company.isVerified && <BadgeCheck size={14} className="text-brand-500" />}
        </p>

        {excerpt && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">{excerpt}</p>}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {job.postedBy && (
              <>
                <Avatar src={undefined} name={job.postedBy.name} size={22} />
                <span className="text-xs font-medium text-ink-500">{job.postedBy.name}</span>
              </>
            )}
            {job.publishedAt && (
              <span className="text-xs text-ink-400">
                {job.postedBy ? '· ' : ''}
                {formatDate(job.publishedAt)}
              </span>
            )}
          </div>

          <Link
            href={`/jobs/${job.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            Apply Now <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
