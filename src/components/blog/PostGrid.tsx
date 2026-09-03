import type { PostCard as PostCardType } from '@/types';
import { PostCard } from './PostCard';

export function PostGrid({ posts, priorityCount = 0 }: { posts: PostCardType[]; priorityCount?: number }) {
  const safePosts = Array.isArray(posts) ? posts : [];
  if (safePosts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink-200 dark:border-ink-700 py-16 text-center text-ink-400 dark:text-ink-500">
        No posts found yet.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {safePosts.map((post, i) => (
        <PostCard key={post.id} post={post} priority={i < priorityCount} />
      ))}
    </div>
  );
}
