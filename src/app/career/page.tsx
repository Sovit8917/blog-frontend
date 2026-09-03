import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, ArrowRight, FileText, MessagesSquare, Wallet, Laptop } from 'lucide-react';
import { getCategory, listPostsByCategory, listPostsByTag, listFollowedTopics } from '@/lib/api';
import { PostGrid } from '@/components/blog/PostGrid';
import { TopicFollowButton } from '@/components/blog/TopicFollowButton';
import { AdSlot } from '@/components/ads/AdSlot';
import { getCurrentUser, getCookieHeader } from '@/lib/auth/session';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'Career Content',
  description:
    'Interview prep, resume advice, salary negotiation, and remote-work guidance for tech careers.',
  path: '/career',
});

export const revalidate = 300;

// The four things people searching "tech career advice" actually look for.
// Each maps to an existing seeded tag so this works with zero backend changes.
const RESOURCE_TAGS = [
  { slug: 'interviews', label: 'Interview Prep', icon: MessagesSquare },
  { slug: 'career-advice', label: 'Resume & Growth', icon: FileText },
  { slug: 'remote-work', label: 'Remote Work', icon: Laptop },
];

export default async function CareerHubPage() {
  const [category, viewer] = await Promise.all([
    getCategory('career-growth').catch(() => null),
    getCurrentUser().catch(() => null),
  ]);

  const [latest, ...byTag] = await Promise.all([
    category
      ? listPostsByCategory('career-growth', { limit: 6 })
      : Promise.resolve({ items: [], meta: { nextCursor: null, hasMore: false, limit: 6 } }),
    ...RESOURCE_TAGS.map((t) => listPostsByTag(t.slug, { limit: 4 }).catch(() => ({ items: [] }))),
  ]);

  let initialFollowing = false;
  if (viewer && category) {
    const topics = await listFollowedTopics(getCookieHeader()).catch(() => []);
    initialFollowing = topics.some((t) => t.category.slug === category.slug);
  }

  return (
    <div className="container-page py-10">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <Compass size={15} /> Career Content
          </p>
          <h1 className="mt-1 text-3xl font-bold text-ink-900 dark:text-ink-100 sm:text-4xl">
            Grow your tech career, not just your resume
          </h1>
          <p className="mt-3 text-ink-500 dark:text-ink-400">
            Interview prep, negotiation, remote-work strategy, and honest lessons from engineers
            who've navigated it — updated every week.
          </p>
        </div>
        {category && (
          <TopicFollowButton
            categorySlug={category.slug}
            initialFollowing={initialFollowing}
            isLoggedIn={Boolean(viewer)}
          />
        )}
      </header>

      {/* Quick jump into the three most-searched sub-topics. */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {RESOURCE_TAGS.map((t) => (
          <Link
            key={t.slug}
            href={`/tag/${t.slug}`}
            className="group flex items-center gap-3 rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 transition hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 transition group-hover:bg-brand-600 dark:group-hover:bg-brand-500 group-hover:text-white">
              <t.icon size={18} />
            </div>
            <span className="font-semibold text-ink-800 dark:text-ink-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">{t.label}</span>
            <ArrowRight size={14} className="ml-auto shrink-0 text-ink-300 dark:text-ink-600 transition group-hover:translate-x-0.5 group-hover:text-brand-500 dark:group-hover:text-brand-400" />
          </Link>
        ))}
      </div>

      <AdSlot placement="HEADER" className="mb-12" />

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-ink-900 dark:text-ink-100">Latest career content</h2>
        <PostGrid posts={latest.items} priorityCount={3} />
      </section>

      {RESOURCE_TAGS.map((t, i) => {
        const items = byTag[i]?.items ?? [];
        if (items.length === 0) return null;
        return (
          <section key={t.slug} className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink-900 dark:text-ink-100">
                <t.icon size={18} className="text-brand-600 dark:text-brand-400" /> {t.label}
              </h2>
              <Link
                href={`/tag/${t.slug}`}
                className="flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-400"
              >
                See all <ArrowRight size={14} />
              </Link>
            </div>
            <PostGrid posts={items} />
          </section>
        );
      })}

      <AdSlot placement="BETWEEN_POSTS" className="mb-12" />

      <section className="rounded-2xl border border-brand-100 dark:border-brand-800 bg-gradient-to-br from-brand-50/60 dark:from-brand-900/40 to-white p-6 text-center">
        <Wallet size={22} className="mx-auto mb-3 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-bold text-ink-900 dark:text-ink-100">Ready to put it into practice?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-500 dark:text-ink-400">
          Browse open roles matched to the skills you're building, or head to Developer Resources
          to learn something new.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/jobs"
            className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
          >
            Browse jobs
          </Link>
          <Link
            href="/skills"
            className="rounded-lg bg-white dark:bg-ink-900 px-4 py-2.5 text-sm font-semibold text-ink-700 dark:text-ink-300 ring-1 ring-inset ring-ink-200 dark:ring-ink-700 transition hover:bg-ink-50 dark:hover:bg-ink-800"
          >
            Developer Resources
          </Link>
        </div>
      </section>
    </div>
  );
}
