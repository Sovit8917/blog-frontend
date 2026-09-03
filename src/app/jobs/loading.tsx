import { Skeleton, JobCardSkeleton, JobRowSkeleton } from '@/components/ui/Skeleton';

export default function JobsLoading() {
  return (
    <div className="bg-slate-50/50 dark:bg-slate-900 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <header className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 sm:p-8 shadow-sm">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="mt-3 h-9 w-72 max-w-full" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        </header>

        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="rounded-xl border border-ink-100 dark:border-ink-800 p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
              <Skeleton className="col-span-2 h-11 lg:col-span-2" />
              <Skeleton className="col-span-2 h-11 lg:col-span-1" />
              <Skeleton className="col-span-2 h-11 lg:col-span-1" />
              <Skeleton className="col-span-2 h-11 lg:col-span-1" />
              <Skeleton className="col-span-2 h-11 lg:col-span-1" />
            </div>
          </div>

          <Skeleton className="h-4 w-32" />

          {/* Mobile: stacked card skeletons */}
          <div className="flex flex-col gap-4 md:hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>

          {/* Tablet/desktop: table skeleton */}
          <div className="hidden overflow-hidden rounded-xl border border-ink-100 dark:border-ink-800 md:block">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800 bg-ink-50/80 dark:bg-ink-900 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Salary</th>
                  <th className="px-4 py-3">Posted</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <JobRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
