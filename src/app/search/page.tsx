import type { Metadata } from 'next';
import { searchPosts } from '@/lib/api';
import { PostGrid } from '@/components/blog/PostGrid';
import { buildListMetadata } from '@/lib/seo/metadata';

interface Props { searchParams: { q?: string; cursor?: string } }

export function generateMetadata({ searchParams }: Props): Metadata {
  return buildListMetadata({
    title: searchParams.q ? `Search: ${searchParams.q}` : 'Search',
    description: 'Search articles across the blog.',
    path: '/search',
  });
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? '';
  const results = q ? await searchPosts(q, { cursor: searchParams.cursor, limit: 12 }) : null;

  return (
    <div className="bg-slate-50/50 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <form action="/search" className="mx-auto max-w-2xl rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search articles, topics, and authors…"
            autoFocus
            className="w-full rounded-full border border-slate-200 px-6 py-3.5 text-base outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </form>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
          {q ? (
            <>
              <p className="mb-6 text-sm font-semibold text-ink-600">
                {results?.items.length ?? 0} result{results?.items.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
              </p>
              <PostGrid posts={results?.items ?? []} />
            </>
          ) : (
            <p className="py-12 text-center text-base text-ink-400">Start typing to search articles across the platform.</p>
          )}
        </div>
      </div>
    </div>
  );
}
