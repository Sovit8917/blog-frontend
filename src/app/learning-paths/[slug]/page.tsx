import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ExternalLink } from 'lucide-react';
import { getLearningPathBySlug } from '@/lib/api/learning-paths';
import { buildListMetadata } from '@/lib/seo/metadata';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = await getLearningPathBySlug(params.slug).catch(() => null);
  if (!path) return {};
  return buildListMetadata({
    title: path.title,
    description: path.description || `A ${path.steps.length}-step learning path.`,
    path: `/learning-paths/${path.slug}`,
  });
}

export const revalidate = 120;

export default async function LearningPathDetailPage({ params }: Props) {
  const path = await getLearningPathBySlug(params.slug).catch(() => null);
  if (!path) notFound();

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900 py-8 lg:py-12">
      <div className="container-page max-w-3xl space-y-8">
        <header className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 sm:p-8 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <GraduationCap size={14} /> Learning Path · {path.steps.length} steps
          </p>
          <h1 className="mt-1 font-serif text-3xl font-extrabold text-ink-950 dark:text-ink-50 sm:text-4xl">{path.title}</h1>
          {path.description && (
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-600 dark:text-ink-400">{path.description}</p>
          )}
        </header>

        <ol className="space-y-4">
          {path.steps.map((step, i) => (
            <li key={step.id} className="flex gap-4 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/40 text-sm font-bold text-brand-700 dark:text-brand-400">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <a
                  href={step.resource.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center gap-1.5 font-serif text-lg font-bold text-ink-950 dark:text-ink-50 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {step.resource.title} <ExternalLink size={14} className="shrink-0 text-ink-400 dark:text-ink-500" />
                </a>
                {step.note && <p className="mt-1 text-sm font-medium text-brand-700 dark:text-brand-400">{step.note}</p>}
                {step.resource.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{step.resource.description}</p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="text-center">
          <Link href="/learning-paths" className="link-underline text-ink-700 dark:text-ink-300">
            Back to all learning paths
          </Link>
        </div>
      </div>
    </div>
  );
}
