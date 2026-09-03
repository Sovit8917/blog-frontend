import { Sparkles } from 'lucide-react';
import type { PostCard as PostCardType } from '@/types';
import { PostCard } from '@/components/blog/PostCard';

/**
 * Personalization step of the loop. Signed-in copy implies the list is
 * tailored to them (their bookmarks/follows feed trending for now, real
 * ranking is a backend concern); signed-out copy is honest that it's
 * showing what's popular, with a nudge to sign in for a tailored version —
 * that nudge is itself what turns a visit into an account.
 */
export function ForYou({ posts, isLoggedIn }: { posts: PostCardType[]; isLoggedIn: boolean }) {
  if (posts.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-ink-900 p-5 sm:p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles size={16} className="text-brand-600 dark:text-brand-400" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400">
          {isLoggedIn ? 'Picked for you' : 'Popular right now — sign in for picks tailored to you'}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.slice(0, 4).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
