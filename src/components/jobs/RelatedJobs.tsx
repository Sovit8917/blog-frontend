import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import type { JobCard as JobCardType } from '@/types';
import { JobCard } from './JobCard';

/**
 * "Jobs related to this article" — skill-matched to the post's tags on the
 * backend (see JobsService.getRelatedToPost). Placed after the article body
 * so a reader deep into a React tutorial sees open React roles right there —
 * this is the tech-jobs-content monetization link between editorial and the
 * job board.
 */
export function RelatedJobs({ jobs }: { jobs: JobCardType[] }) {
  if (jobs.length === 0) return null;
  return (
    <section className="mt-16 border-t border-ink-100 dark:border-ink-800 pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-ink-900 dark:text-ink-100">
          <Briefcase size={20} className="text-brand-600 dark:text-brand-400" />
          Jobs related to this article
        </h2>
        <Link href="/jobs" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-400">
          Browse all jobs →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
