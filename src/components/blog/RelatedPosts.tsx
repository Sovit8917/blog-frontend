import type { PostCard as PostCardType } from '@/types';
import { PostCard } from './PostCard';

export function RelatedPosts({ posts }: { posts: PostCardType[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="mt-16 border-t border-ink-100 pt-10">
      <h2 className="mb-6 text-xl font-bold text-ink-900">Keep reading</h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
