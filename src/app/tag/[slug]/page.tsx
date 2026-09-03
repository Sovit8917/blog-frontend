import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTag, listPostsByTag } from '@/lib/api';
import { PostGrid } from '@/components/blog/PostGrid';
import { Sidebar } from '@/components/blog/Sidebar';
import { AdSlot } from '@/components/ads/AdSlot';
import { buildListMetadata } from '@/lib/seo/metadata';

interface Props { params: { slug: string }; searchParams: { cursor?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await getTag(params.slug).catch(() => null);
  if (!tag) return {};
  return buildListMetadata({
    title: `#${tag.name}`,
    description: `Posts tagged #${tag.name}`,
    path: `/tag/${tag.slug}`,
  });
}

export const revalidate = 300;

export default async function TagPage({ params, searchParams }: Props) {
  const tag = await getTag(params.slug).catch(() => null);
  if (!tag) notFound();

  const posts = await listPostsByTag(params.slug, { cursor: searchParams.cursor, limit: 9 });

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <header className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Tag</p>
          <h1 className="mt-1 font-serif text-3xl font-extrabold text-ink-950 dark:text-ink-50 sm:text-4xl">#{tag.name}</h1>
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
