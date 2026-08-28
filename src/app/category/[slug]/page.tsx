import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategory, listPostsByCategory } from '@/lib/api';
import { PostGrid } from '@/components/blog/PostGrid';
import { Sidebar } from '@/components/blog/Sidebar';
import { buildListMetadata } from '@/lib/seo/metadata';

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
  const category = await getCategory(params.slug).catch(() => null);
  if (!category) notFound();

  const posts = await listPostsByCategory(params.slug, { cursor: searchParams.cursor, limit: 9 });

  return (
    <div className="bg-slate-50/50 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <header className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Category</p>
          <h1 className="mt-1 font-serif text-3xl font-extrabold text-ink-950 sm:text-4xl">{category.name}</h1>
          {category.description && <p className="mt-3 text-lg leading-relaxed text-ink-600">{category.description}</p>}
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
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
