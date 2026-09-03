import { Skeleton } from '@/components/ui/Skeleton';

export default function JobDetailLoading() {
  return (
    <div className="bg-slate-50/50 dark:bg-slate-900 pb-28 pt-8 lg:pb-12 lg:pt-12">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
          <div>
            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-9 w-2/3" />
              <div className="mt-3 flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="mt-6 h-16 w-full rounded-xl" />
              <div className="mt-6 hidden gap-3 sm:flex">
                <Skeleton className="h-11 w-32 rounded-lg" />
                <Skeleton className="h-11 w-24 rounded-lg" />
              </div>
            </div>

            <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </section>

            <div className="mt-6 space-y-3 rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 shadow-sm sm:p-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <aside className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </aside>
        </div>
      </div>
    </div>
  );
}
