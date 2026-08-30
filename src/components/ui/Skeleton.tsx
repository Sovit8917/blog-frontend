import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[16/9] w-full" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

/** Mirrors JobCard.tsx's layout so the mobile job-list skeleton doesn't jump around once real content lands. */
export function JobCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink-100 p-5">
      <Skeleton className="h-5 w-3/4" />
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-5 w-32" />
      <div className="flex gap-3">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3.5 w-20" />
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );
}

/** Mirrors JobRow.tsx's columns for the tablet/desktop table skeleton. */
export function JobRowSkeleton() {
  return (
    <tr className="border-b border-ink-100 last:border-0">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </td>
      <td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td>
      <td className="px-4 py-4"><Skeleton className="h-4 w-20" /></td>
      <td className="px-4 py-4"><Skeleton className="h-4 w-20" /></td>
      <td className="px-4 py-4"><Skeleton className="h-4 w-14" /></td>
      <td className="px-4 py-4"><Skeleton className="h-7 w-16 rounded-lg" /></td>
    </tr>
  );
}
