import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, LogIn } from 'lucide-react';
import { listForYou, listMostRead } from '@/lib/api';
import { getCurrentUser, getCookieHeader } from '@/lib/auth/session';
import { PostGrid } from '@/components/blog/PostGrid';
import { AdSlot } from '@/components/ads/AdSlot';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'For You',
  description: 'Stories picked for you based on what you follow and read.',
  path: '/for-you',
});

export default async function ForYouPage() {
  const user = await getCurrentUser().catch(() => null);

  // Signed-in visitors get the real, ranked feed (follows + read signals,
  // see FeedService.forYou on the backend). Signed-out visitors see the
  // same "Most Read This Week" fallback the backend itself uses for brand
  // new accounts with no signal yet, so the page is never empty and still
  // makes the case for signing in.
  const posts = user
    ? await listForYou(24, getCookieHeader()).catch(() => [])
    : await listMostRead(7, 12).catch(() => []);

  return (
    <div className="container-page py-10">
      <header className="mb-8 max-w-2xl">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          <Sparkles size={15} /> For You
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink-900 dark:text-ink-100 sm:text-4xl">
          {user ? 'Picked for you' : "What's popular right now"}
        </h1>
        <p className="mt-3 text-ink-500 dark:text-ink-400">
          {user
            ? "Ranked from the authors and topics you follow, plus what you've been reading lately."
            : 'Sign in and this feed becomes tailored to the authors, topics, and jobs you actually care about.'}
        </p>
      </header>

      {!user && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 dark:border-brand-800 bg-brand-50/60 dark:bg-brand-900/40 px-5 py-4">
          <p className="text-sm font-medium text-ink-700 dark:text-ink-300">
            Follow topics and authors to get a feed built around your career goals.
          </p>
          <Link
            href="/login?redirect=/for-you"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
          >
            <LogIn size={15} /> Sign in
          </Link>
        </div>
      )}

      <AdSlot placement="HEADER" className="mb-8" />

      <PostGrid posts={posts} priorityCount={3} />
    </div>
  );
}
