import Link from 'next/link';
import Image from 'next/image';
import { Flame } from 'lucide-react';
import type { MostReadPost } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { readingTimeLabel } from '@/lib/utils';

/**
 * "🔥 Most Read This Week" — social proof rail powered by GET /posts/most-read
 * (7-day rolling view rollup, falls back to lifetime views on a cold start so
 * it's never empty). Placed right under the hero: it's the single fastest
 * way for a new visitor to see what this community already values, before
 * they've had a chance to build any personalization signal of their own.
 */
export function MostReadWidget({ posts }: { posts: MostReadPost[] }) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  return (
    <section className="rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <Flame size={16} className="text-orange-500" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-700 dark:text-ink-300">Most read this week</h2>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
        {posts.slice(0, 5).map((post, i) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-3 lg:flex-col">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800 lg:h-28 lg:w-full">
              {post.coverImageUrl ? (
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 64px, 20vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-lg font-extrabold text-ink-300 dark:text-ink-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] font-bold text-white">
                {i + 1}
              </span>
            </div>
            <div className="min-w-0">
              {post.category && (
                <Badge variant="brand" className="mb-1.5">
                  {post.category.name}
                </Badge>
              )}
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 dark:text-ink-100 transition group-hover:text-brand-600 dark:group-hover:text-brand-400">
                {post.title}
              </h3>
              <p className="mt-1 text-[11px] font-medium text-ink-400 dark:text-ink-500">
                {readingTimeLabel(post.readingTimeMins)}
                {typeof post.weeklyViews === 'number' && post.weeklyViews > 0 && (
                  <> · {post.weeklyViews.toLocaleString()} reads</>
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
