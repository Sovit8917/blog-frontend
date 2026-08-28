import { PostCardSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="container-page py-10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
