import { Sparkles } from 'lucide-react';
import { getRecommendedJobs } from '@/lib/api/jobs';
import { getCookieHeader, getCurrentUser } from '@/lib/auth/session';
import { JobCard } from './JobCard';

/**
 * "Jobs for you" (#20) — a personalized row above the full board, visible
 * only when signed in (the backend endpoint requires auth and has nothing
 * to rank against for anonymous visitors anyway).
 */
export async function RecommendedJobsSection() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return null;

  const { items, personalized } = await getRecommendedJobs(getCookieHeader(), 6);
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={16} className="text-brand-600" />
        <h2 className="text-lg font-bold text-ink-900">
          {personalized ? 'Jobs for you' : 'Jobs to get you started'}
        </h2>
      </div>
      <p className="mb-5 text-sm text-ink-500">
        {personalized
          ? 'Matched to your saved skills and job preferences.'
          : 'Save or apply to a few jobs, or set your job preferences, and this section will start tailoring itself to you.'}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((job) => (
          <div key={job.id} className="relative">
            {personalized && typeof job.matchScore === 'number' && job.matchScore > 0 && (
              <span className="absolute right-3 top-3 z-10 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                {job.matchScore}% match
              </span>
            )}
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
}
