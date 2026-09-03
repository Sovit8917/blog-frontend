import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, ListChecks } from 'lucide-react';
import { listLearningPaths } from '@/lib/api/learning-paths';
import { OffsetPager } from '@/components/ui/OffsetPager';
import { buildListMetadata } from '@/lib/seo/metadata';

interface Props { searchParams: { search?: string; page?: string } }

export const metadata: Metadata = buildListMetadata({
  title: 'Learning Paths',
  description: 'Curated, ordered sequences through our developer resources — a guided route instead of a pile of links.',
  path: '/learning-paths',
});

export const revalidate = 300;

export default async function LearningPathsPage({ searchParams }: Props) {
  const search = searchParams.search?.trim() || undefined;
  const page = Number(searchParams.page) || 1;
  const result = await listLearningPaths({ search, page, limit: 18 });

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <header className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 sm:p-8 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <GraduationCap size={14} /> Learning Paths
          </p>
          <h1 className="mt-1 font-serif text-3xl font-extrabold text-ink-950 dark:text-ink-50 sm:text-4xl">
            Guided routes through our resources
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-600 dark:text-ink-400">
            Ordered, step-by-step sequences through our{' '}
            <Link href="/resources" className="link-underline text-ink-800 dark:text-ink-200">
              developer resources
            </Link>{' '}
            catalog — start at step one and work through, instead of guessing where to begin.
          </p>
        </header>

        {result.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 py-16 text-center text-ink-400 dark:text-ink-500">
            No learning paths published yet — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((path) => (
              <Link
                key={path.id}
                href={`/learning-paths/${path.slug}`}
                className="flex flex-col gap-3 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 transition hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
                  <ListChecks size={14} /> {path.steps.length} step{path.steps.length === 1 ? '' : 's'}
                </div>
                <h2 className="font-serif text-lg font-bold text-ink-950 dark:text-ink-50">{path.title}</h2>
                {path.description && (
                  <p className="line-clamp-3 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{path.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}

        <OffsetPager basePath="/learning-paths" params={{ search }} page={result.meta.page} totalPages={result.meta.totalPages} />
      </div>
    </div>
  );
}
