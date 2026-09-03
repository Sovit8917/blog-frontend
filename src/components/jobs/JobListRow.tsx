import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Building2, ArrowUpRight, Sparkles } from "lucide-react";
import type { JobCard as JobCardType } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, stripMarkdown, truncate } from "@/lib/utils";
import { getJobCompany } from "@/lib/jobs/format";

const TECH_TAG_STYLES: Record<string, string> = {
  REACT: "bg-cyan-50 text-cyan-700 border-cyan-200/80 hover:bg-cyan-100/70",
  TYPESCRIPT:
    "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/80 dark:border-blue-800 hover:bg-blue-100/70 dark:hover:bg-blue-900/30",
  "NEXT.JS":
    "bg-slate-900 text-white border-slate-800 dark:border-slate-200 hover:bg-slate-800",
  NEXTJS:
    "bg-slate-900 text-white border-slate-800 dark:border-slate-200 hover:bg-slate-800",
  JAVASCRIPT:
    "bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800 hover:bg-amber-100/70 dark:hover:bg-amber-900/30",
  PYTHON:
    "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/30",
  JAVA: "bg-orange-50 text-orange-800 border-orange-200/80 hover:bg-orange-100/70",
  "NODE.JS":
    "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200/80 dark:border-green-800 hover:bg-green-100/70 dark:hover:bg-green-900/30",
  NODEJS:
    "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200/80 dark:border-green-800 hover:bg-green-100/70 dark:hover:bg-green-900/30",
  "C++":
    "bg-indigo-50 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100/70",
  AWS: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300/80 dark:border-amber-700 hover:bg-amber-500/20",
  SQL: "bg-violet-50 text-violet-700 border-violet-200/80 hover:bg-violet-100/70",
  LINUX: "bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200",
  GOLANG: "bg-sky-50 text-sky-700 border-sky-200/80 hover:bg-sky-100/70",
  GO: "bg-sky-50 text-sky-700 border-sky-200/80 hover:bg-sky-100/70",
  DOCKER:
    "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/80 dark:border-blue-800 hover:bg-blue-100/70 dark:hover:bg-blue-900/30",
  KUBERNETES:
    "bg-indigo-50 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100/70",
};

function getTagStyle(tag: string) {
  const normalized = tag.toUpperCase().trim();
  return (
    TECH_TAG_STYLES[normalized] ||
    "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
  );
}

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
    <article className="flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800 py-6 first:pt-0 last:border-0 last:pb-0 sm:flex-row">
      <Link
        href={`/jobs/${job.slug}`}
        className="group/img relative flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 sm:h-32 sm:w-48"
      >
        {banner ? (
          <Image
            src={banner}
            alt={company.name}
            fill
            className={
              company.logoUrl === banner
                ? "object-contain p-6 transition-transform duration-300 group-hover/img:scale-105"
                : "object-cover transition-transform duration-300 group-hover/img:scale-105"
            }
            sizes="(max-width: 640px) 100vw, 192px"
          />
        ) : (
          <Building2 size={28} className="text-ink-300 dark:text-ink-600" />
        )}
        {job.isFeatured && (
          <div className="absolute left-2 top-2 z-10">
            <span className="inline-flex items-center gap-1 rounded bg-ink-950/95 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm border border-white/10">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Featured
            </span>
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          {job.tags?.slice(0, 5).map((tag) => (
            <Link
              key={tag}
              href={`/jobs?search=${encodeURIComponent(tag)}`}
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-95 ${getTagStyle(
                tag,
              )}`}
            >
              {tag}
            </Link>
          ))}
        </div>

        <Link href={`/jobs/${job.slug}`} className="group">
          <h2 className="text-lg font-bold leading-snug text-ink-950 dark:text-ink-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 sm:text-xl">
            {job.title}
          </h2>
        </Link>

        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink-600 dark:text-ink-400">
          {company.name}
          {company.isVerified && (
            <BadgeCheck
              size={14}
              className="text-brand-500 dark:text-brand-400"
            />
          )}
        </p>

        {excerpt && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
            {excerpt}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {job.postedBy && (
              <>
                <Avatar src={undefined} name={job.postedBy.name} size={22} />
                <span className="text-xs font-medium text-ink-500 dark:text-ink-400">
                  {job.postedBy.name}
                </span>
              </>
            )}
            {job.publishedAt && (
              <span className="text-xs text-ink-400 dark:text-ink-500">
                {job.postedBy ? "· " : ""}
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
