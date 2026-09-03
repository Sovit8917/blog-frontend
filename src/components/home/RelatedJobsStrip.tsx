import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import type { JobCard as JobCardType } from "@/types";
import { formatSalaryRange, REMOTE_TYPE_LABEL, getJobCompany } from "@/lib/jobs/format";

/**
 * Sits inline in the reading flow (between article rows) instead of only in
 * the sidebar, so readers moving from "read an article" toward "browse jobs"
 * don't have to go hunting for the job board first.
 */
export function RelatedJobsStrip({ jobs }: { jobs: JobCardType[] }) {
  if (jobs.length === 0) return null;

  return (
    <section className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-900 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400">
          Jobs from the community
        </h2>
        <Link
          href="/jobs"
          className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-400"
        >
          View all jobs <ArrowRight size={13} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {jobs.slice(0, 3).map((job) => {
          const company = getJobCompany(job);
          return (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
            className="group flex flex-col gap-2 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 transition hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-ink-100 dark:bg-ink-800">
                {company.logoUrl ? (
                  <Image
                    src={company.logoUrl}
                    alt={company.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-ink-400 dark:text-ink-500">
                    {company.name[0]}
                  </span>
                )}
              </div>
              <span className="truncate text-xs font-medium text-ink-500 dark:text-ink-400">
                {company.name}
              </span>
            </div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 dark:text-ink-100 transition group-hover:text-brand-600 dark:group-hover:text-brand-400">
              {job.title}
            </h3>
            <div className="mt-auto flex items-center justify-between text-[11px] text-ink-400 dark:text-ink-500">
              <span className="flex items-center gap-1">
                <MapPin size={11} />{" "}
                {job.location ?? REMOTE_TYPE_LABEL[job.remoteType]}
              </span>
              {formatSalaryRange(
                job.salaryMin,
                job.salaryMax,
                job.salaryCurrency,
              ) && (
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {formatSalaryRange(
                    job.salaryMin,
                    job.salaryMax,
                    job.salaryCurrency,
                  )}
                </span>
              )}
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
