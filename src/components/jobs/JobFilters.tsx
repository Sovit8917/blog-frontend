'use client';

import { useEffect, useState } from 'react';
import { SlidersHorizontal, ChevronDown, Search, MapPin, Briefcase, GraduationCap, Laptop, RotateCcw, BadgeCheck } from 'lucide-react';
import type { ListJobsParams } from '@/types';
import { EMPLOYMENT_TYPE_LABEL, EXPERIENCE_LEVEL_LABEL, REMOTE_TYPE_LABEL } from '@/lib/jobs/format';
import { suggestJobs } from '@/lib/api/jobs';

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 text-sm text-ink-800 outline-none placeholder:text-ink-400 transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10';
const labelClass = 'mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-500';

/**
 * Job search UX (P0): a plain <input list="…"> typeahead backed by
 * GET /jobs/suggest. Deliberately not a full custom dropdown component —
 * the native <datalist> gets keyboard nav, screen-reader support, and
 * mobile behavior for free, and this form is a classic GET <form> (no JS
 * required to submit), so the enhancement stays additive rather than
 * replacing the input.
 */
function SearchSuggestInput({ defaultValue }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setOptions([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      suggestJobs(q).then((res) => {
        if (cancelled) return;
        setOptions([...res.titles, ...res.skills.map((s) => s.name)].slice(0, 8));
      });
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value]);

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
      <input
        id="job-search"
        type="search"
        name="search"
        list="job-search-suggestions"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Job title, skill, or keyword…"
        className={`${fieldClass} pl-10`}
      />
      <datalist id="job-search-suggestions">
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </div>
  );
}

export function JobFilters({ params }: { params: ListJobsParams }) {
  const activeCount = [
    params.location,
    params.remoteType,
    params.employmentType,
    params.experienceLevel,
    params.freshersOnly ? true : undefined,
    params.verifiedOnly ? true : undefined,
    params.sort && params.sort !== 'relevance' ? params.sort : undefined,
  ].filter(Boolean).length;

  return (
    <form
      action="/jobs"
      method="GET"
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        {/* Search Query Input */}
        <div className="lg:col-span-2">
          <label className={labelClass} htmlFor="job-search">
            <Search size={13} className="text-brand-600" /> Search Keyword
          </label>
          <SearchSuggestInput defaultValue={params.search} />
        </div>

        {/* Mobile toggle button */}
        <input type="checkbox" id="job-more-filters" className="peer hidden" />
        <label
          htmlFor="job-more-filters"
          className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-ink-700 lg:hidden"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-brand-600" />
            Filter Options
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown size={16} className="transition peer-checked:rotate-180" />
        </label>

        {/* Filters Grid */}
        <div className="hidden grid-cols-1 gap-4 peer-checked:grid sm:grid-cols-2 lg:col-span-4 lg:!grid lg:grid-cols-4">
          <div>
            <label className={labelClass} htmlFor="job-location">
              <MapPin size={13} className="text-brand-600" /> Location
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
              <input
                id="job-location"
                type="text"
                name="location"
                defaultValue={params.location}
                placeholder="City, country or remote…"
                className={`${fieldClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="job-remote">
              <Laptop size={13} className="text-brand-600" /> Work Mode
            </label>
            <select id="job-remote" name="remoteType" defaultValue={params.remoteType ?? ''} className={`${fieldClass} px-3`}>
              <option value="">Any Mode</option>
              {Object.entries(REMOTE_TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="job-employment">
              <Briefcase size={13} className="text-brand-600" /> Employment
            </label>
            <select
              id="job-employment"
              name="employmentType"
              defaultValue={params.employmentType ?? ''}
              className={`${fieldClass} px-3`}
            >
              <option value="">Any Type</option>
              {Object.entries(EMPLOYMENT_TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="job-experience">
              <GraduationCap size={13} className="text-brand-600" /> Experience
            </label>
            <select
              id="job-experience"
              name="experienceLevel"
              defaultValue={params.experienceLevel ?? ''}
              className={`${fieldClass} px-3`}
            >
              <option value="">Any Level</option>
              {Object.entries(EXPERIENCE_LEVEL_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick filter chips (P0 Fresher/Internship filters + Job quality/verification) */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <label
          htmlFor="job-freshers-only"
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-ink-600 transition has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700"
        >
          <input
            id="job-freshers-only"
            type="checkbox"
            name="freshersOnly"
            value="true"
            defaultChecked={!!params.freshersOnly}
            className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          <GraduationCap size={13} /> Freshers &amp; Internships
        </label>
        <label
          htmlFor="job-verified-only"
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-ink-600 transition has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald-700"
        >
          <input
            id="job-verified-only"
            type="checkbox"
            name="verifiedOnly"
            value="true"
            defaultChecked={!!params.verifiedOnly}
            className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <BadgeCheck size={13} /> Verified jobs only
        </label>
      </div>

      {/* Form Action Bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 active:scale-[0.99]"
          >
            <Search size={16} />
            Search Jobs
          </button>
          {activeCount > 0 && (
            <a
              href="/jobs"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-slate-50 hover:text-ink-900"
            >
              <RotateCcw size={14} /> Reset
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Sort by:</span>
          <select
            id="job-sort"
            name="sort"
            defaultValue={params.sort ?? 'relevance'}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
          >
            <option value="relevance">Most relevant</option>
            <option value="newest">Newest first</option>
            <option value="salary">Highest salary</option>
          </select>
        </div>
      </div>
    </form>
  );
}
