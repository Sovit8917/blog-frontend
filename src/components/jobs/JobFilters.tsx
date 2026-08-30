import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import type { ListJobsParams } from '@/types';
import { EMPLOYMENT_TYPE_LABEL, EXPERIENCE_LEVEL_LABEL, REMOTE_TYPE_LABEL } from '@/lib/jobs/format';

const fieldClass =
  'w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-700 outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-400';

/**
 * Plain `<form method="GET">` so filtering works without client JS and the
 * result is a shareable/bookmarkable URL — consistent with how `/search`
 * handles its query param in this codebase.
 *
 * Mobile: search stays visible, the other five fields collapse behind a
 * "Filters" toggle (a hidden checkbox + CSS `peer`, no client JS needed) so
 * the page doesn't open with a wall of six stacked form fields before any
 * jobs are visible. Desktop keeps everything expanded in the original grid.
 */
export function JobFilters({ params }: { params: ListJobsParams }) {
  const activeCount = [
    params.location,
    params.remoteType,
    params.employmentType,
    params.experienceLevel,
    params.sort && params.sort !== 'relevance' ? params.sort : undefined,
  ].filter(Boolean).length;

  return (
    <form
      action="/jobs"
      method="GET"
      className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <div className="col-span-2 lg:col-span-2">
          <label className={labelClass} htmlFor="job-search">
            Search
          </label>
          <input
            id="job-search"
            type="search"
            name="search"
            defaultValue={params.search}
            placeholder="Job title, keyword…"
            className={fieldClass}
          />
        </div>

        {/* Mobile-only toggle for the fields below. Irrelevant at lg, where
            everything is always visible, so it's hidden there. The checkbox
            has to precede everything that reacts to `peer-checked:` in the
            DOM — CSS sibling selectors only look forward. */}
        <input type="checkbox" id="job-more-filters" className="peer hidden" />
        <label
          htmlFor="job-more-filters"
          className="col-span-2 flex cursor-pointer items-center justify-between rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm font-medium text-ink-700 lg:hidden"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={15} />
            More filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-semibold text-white">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown size={16} />
        </label>

        <div className="col-span-2 hidden grid-cols-2 gap-4 peer-checked:grid sm:grid-cols-4 lg:col-span-4 lg:!grid lg:grid-cols-4">
          <div>
            <label className={labelClass} htmlFor="job-location">
              Location
            </label>
            <input
              id="job-location"
              type="text"
              name="location"
              defaultValue={params.location}
              placeholder="City, country…"
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="job-remote">
              Work mode
            </label>
            <select id="job-remote" name="remoteType" defaultValue={params.remoteType ?? ''} className={fieldClass}>
              <option value="">Any</option>
              {Object.entries(REMOTE_TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="job-employment">
              Employment
            </label>
            <select
              id="job-employment"
              name="employmentType"
              defaultValue={params.employmentType ?? ''}
              className={fieldClass}
            >
              <option value="">Any</option>
              {Object.entries(EMPLOYMENT_TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="job-experience">
              Experience
            </label>
            <select
              id="job-experience"
              name="experienceLevel"
              defaultValue={params.experienceLevel ?? ''}
              className={fieldClass}
            >
              <option value="">Any</option>
              {Object.entries(EXPERIENCE_LEVEL_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-4">
            <label className={labelClass} htmlFor="job-sort">
              Sort by
            </label>
            <select id="job-sort" name="sort" defaultValue={params.sort ?? 'relevance'} className={`${fieldClass} lg:w-56`}>
              <option value="relevance">Most relevant</option>
              <option value="newest">Newest</option>
              <option value="salary">Highest salary</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
        <button
          type="submit"
          className="rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800"
        >
          Apply filters
        </button>
        {activeCount > 0 && (
          <a href="/jobs" className="text-sm font-medium text-ink-500 transition hover:text-ink-800">
            Clear all
          </a>
        )}
      </div>
    </form>
  );
}
