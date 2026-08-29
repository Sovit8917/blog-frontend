import Link from 'next/link';
import { SearchX } from 'lucide-react';
import type { JobCard as JobCardType } from '@/types';
import { JobCard } from './JobCard';
import { JobRow } from './JobRow';

/**
 * Renders the job list. Below `md` we fall back to stacked `JobCard`s
 * (a table doesn't respond well to narrow viewports); at `md` and up we
 * switch to a proper table so people can scan role / location / type /
 * salary / posted date across many rows at once.
 */
export function JobGrid({ jobs, hasActiveFilters = false }: { jobs: JobCardType[]; hasActiveFilters?: boolean }) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-ink-200 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-50 text-ink-400">
          <SearchX size={22} />
        </span>
        <div>
          <p className="font-semibold text-ink-800">No jobs match your filters</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">
            {hasActiveFilters
              ? "Try removing a filter or broadening your search — location and keyword tend to narrow results the most."
              : "There aren't any open roles right now. Check back soon."}
          </p>
        </div>
        {hasActiveFilters && (
          <Link
            href="/jobs"
            className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-800"
          >
            Clear all filters
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Tablet/desktop: table */}
      <div className="hidden overflow-hidden rounded-xl border border-ink-100 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/80 text-xs font-semibold uppercase tracking-wider text-ink-500">
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Posted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
