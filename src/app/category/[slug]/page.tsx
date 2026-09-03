import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategory, listPostsByCategory, listFollowedTopics } from '@/lib/api';
import { PostGrid } from '@/components/blog/PostGrid';
import { Sidebar } from '@/components/blog/Sidebar';
import { TopicFollowButton } from '@/components/blog/TopicFollowButton';
import { AdSlot } from '@/components/ads/AdSlot';
import { buildListMetadata } from '@/lib/seo/metadata';
import { getCurrentUser, getCookieHeader } from '@/lib/auth/session';

interface Props { params: { slug: string }; searchParams: { cursor?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategory(params.slug).catch(() => null);
  if (!category) return {};
  return buildListMetadata({
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description || `Latest posts in ${category.name}`,
    path: `/category/${category.slug}`,
    image: category.ogImageUrl,
  });
}

export const revalidate = 300;

export default async function CategoryPage({ params, searchParams }: Props) {
  const [category, viewer] = await Promise.all([
    getCategory(params.slug).catch(() => null),
    getCurrentUser().catch(() => null),
  ]);
  if (!category) notFound();

  const posts = await listPostsByCategory(params.slug, { cursor: searchParams.cursor, limit: 9 });

  let initialFollowing = false;
  if (viewer) {
    const topics = await listFollowedTopics(getCookieHeader()).catch(() => []);
    initialFollowing = topics.some((t) => t.category.slug === category.slug);
  }

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <header className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Category</p>
            <h1 className="mt-1 font-serif text-3xl font-extrabold text-ink-950 dark:text-ink-50 sm:text-4xl">{category.name}</h1>
            {category.description && <p className="mt-3 text-lg leading-relaxed text-ink-600 dark:text-ink-400">{category.description}</p>}
          </div>
          <TopicFollowButton
            categorySlug={category.slug}
            initialFollowing={initialFollowing}
            isLoggedIn={!!viewer}
          />
        </header>

        <AdSlot placement="HEADER" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 sm:p-8 shadow-sm">
            <PostGrid posts={posts.items} priorityCount={3} />
          </div>
          <div>
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
