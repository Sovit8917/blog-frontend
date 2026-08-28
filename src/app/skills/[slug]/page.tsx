import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSkillBySlug, listJobsBySkill } from '@/lib/api';
import { JobGrid } from '@/components/jobs/JobGrid';
import { LoadMoreLink } from '@/components/ui/LoadMoreLink';
import { buildListMetadata } from '@/lib/seo/metadata';

interface Props { params: { slug: string }; searchParams: { cursor?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const skill = await getSkillBySlug(params.slug).catch(() => null);
  if (!skill) return {};
  return buildListMetadata({
    title: `${skill.name} jobs`,
    description: `Open roles that use ${skill.name}.`,
    path: `/skills/${skill.slug}`,
  });
}

export const revalidate = 60;

export default async function SkillDetailPage({ params, searchParams }: Props) {
  const skill = await getSkillBySlug(params.slug);
  if (!skill) notFound();

  const jobsParams = { cursor: searchParams.cursor, limit: 12 };
  const page = await listJobsBySkill(params.slug, jobsParams);

  return (
    <div className="container-page py-10">
      <header className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Developer Resources</p>
        <h1 className="mt-1 text-3xl font-bold text-ink-900 sm:text-4xl">{skill.name} jobs</h1>
        <p className="mt-3 text-ink-500">
          {skill._count?.jobs ?? page.items.length} open role{(skill._count?.jobs ?? page.items.length) === 1 ? '' : 's'} using {skill.name}.
        </p>
      </header>

      <JobGrid jobs={page.items} />

      {page.meta.hasMore && page.meta.nextCursor && (
        <LoadMoreLink basePath={`/skills/${skill.slug}`} params={jobsParams} cursor={page.meta.nextCursor} />
      )}
    </div>
  );
}
