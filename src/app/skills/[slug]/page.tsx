import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, Briefcase, ArrowRight, Wrench } from 'lucide-react';
import { getSkillBySlug, listJobsBySkill, listPostsByTag, searchPosts, listDeveloperResources } from '@/lib/api';
import { JobGrid } from '@/components/jobs/JobGrid';
import { PostGrid } from '@/components/blog/PostGrid';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { LoadMoreLink } from '@/components/ui/LoadMoreLink';
import { buildListMetadata } from '@/lib/seo/metadata';

interface Props { params: { slug: string }; searchParams: { cursor?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const skill = await getSkillBySlug(params.slug).catch(() => null);
  if (!skill) return {};
  return buildListMetadata({
    title: `${skill.name} — Jobs & Learning Resources`,
    description: `Tutorials, articles, and open roles for ${skill.name}.`,
    path: `/skills/${skill.slug}`,
  });
}

export const revalidate = 60;

export default async function SkillDetailPage({ params, searchParams }: Props) {
  const skill = await getSkillBySlug(params.slug);
  if (!skill) notFound();

  const jobsParams = { cursor: searchParams.cursor, limit: 12 };

  // Educational content lookup: tags aren't guaranteed to share a slug with
  // the skill (e.g. skill "node-js" vs tag "javascript"), so try an exact
  // tag match first, then fall back to a full-text search on the skill's
  // name so the page still shows *something* to learn from, not just jobs.
  const [page, byTag, resourcesByTag] = await Promise.all([
    listJobsBySkill(params.slug, jobsParams),
    listPostsByTag(params.slug, { limit: 6 }).catch(() => ({ items: [] })),
    // Same tag-then-name-search fallback, applied to the curated Developer
    // Resources catalog — this is the third leg of the loop (Skill →
    // Article, Skill → Job, and now Skill → Resource) so a visitor
    // learning a technology doesn't have to separately think to check
    // /resources for tools that use the exact same tag vocabulary.
    listDeveloperResources({ tag: params.slug, limit: 4 }).catch(() => ({ items: [] })),
  ]);
  let articles = byTag.items;
  if (articles.length === 0) {
    const bySearch = await searchPosts(skill.name, { limit: 6 }).catch(() => ({ items: [] }));
    articles = bySearch.items;
  }
  let resources = resourcesByTag.items;
  if (resources.length === 0) {
    const bySearch = await listDeveloperResources({ search: skill.name, limit: 4 }).catch(() => ({ items: [] }));
    resources = bySearch.items;
  }

  return (
    <div className="container-page py-10">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Skills &amp; Technologies</p>
        <h1 className="mt-1 text-3xl font-bold text-ink-900 sm:text-4xl">{skill.name}</h1>
        <p className="mt-3 text-ink-500">
          Learn {skill.name} from our articles below, then browse{' '}
          {skill._count?.jobs ?? page.items.length} open role
          {(skill._count?.jobs ?? page.items.length) === 1 ? '' : 's'} that use it.
        </p>
      </header>

      <section className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <BookOpen size={18} className="text-brand-600" />
          <h2 className="text-xl font-bold text-ink-900">Learn {skill.name}</h2>
        </div>
        {articles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink-200 py-10 text-center text-ink-400">
            No {skill.name} articles yet.{' '}
            <Link href="/blog" className="link-underline text-ink-700">
              Browse all articles
            </Link>{' '}
            or check back soon.
          </div>
        ) : (
          <PostGrid posts={articles} />
        )}
      </section>

      {resources.length > 0 && (
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench size={18} className="text-brand-600" />
              <h2 className="text-xl font-bold text-ink-900">{skill.name} tools &amp; resources</h2>
            </div>
            <Link
              href="/resources"
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Browse all resources <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-brand-600" />
            <h2 className="text-xl font-bold text-ink-900">{skill.name} jobs</h2>
          </div>
          <Link
            href={`/jobs?skill=${skill.slug}`}
            className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Search jobs <ArrowRight size={14} />
          </Link>
        </div>

        <JobGrid jobs={page.items} />

        {page.meta.hasMore && page.meta.nextCursor && (
          <LoadMoreLink basePath={`/skills/${skill.slug}`} params={jobsParams} cursor={page.meta.nextCursor} />
        )}
      </section>
    </div>
  );
}
