import type { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, ArrowRight, Users, Building2, Code2, Wrench } from 'lucide-react';
import { unifiedSearch } from '@/lib/api';
import { PostGrid } from '@/components/blog/PostGrid';
import { JobGrid } from '@/components/jobs/JobGrid';
import { CompanyCard } from '@/components/companies/CompanyCard';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { Avatar } from '@/components/ui/Avatar';
import { buildListMetadata } from '@/lib/seo/metadata';

interface Props { searchParams: { q?: string } }

export function generateMetadata({ searchParams }: Props): Metadata {
  return buildListMetadata({
    title: searchParams.q ? `Search: ${searchParams.q}` : 'Search',
    description: 'Search articles, jobs, companies, skills, resources, and authors across the platform.',
    path: '/search',
  });
}

/**
 * The single search box in the header now fans out across every pillar of
 * the ecosystem in one request (`GET /search`, see the backend's
 * SearchModule) instead of the page making its own separate calls per
 * pillar. That's what actually makes the pillars "reinforce each other"
 * here: a reader typing a technology name sees the tutorial that teaches
 * it, the jobs that need it, the companies hiring for it, the skill hub
 * that ties those together, and the tools/docs to go learn it with — on
 * one screen, not five different searches.
 */
export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? '';
  const results = q ? await unifiedSearch(q, 6) : null;

  return (
    <div className="bg-slate-50/50 py-8 lg:py-12">
      <div className="container-page space-y-6">
        <form action="/search" className="mx-auto max-w-2xl rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search articles, jobs, companies, skills, resources, and authors…"
            autoFocus
            className="w-full rounded-full border border-slate-200 px-6 py-3.5 text-base outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </form>

        {!q ? (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
            <p className="py-12 text-center text-base text-ink-400">
              Start typing to search everything — articles, jobs, companies, skills, resources, and authors.
            </p>
          </div>
        ) : (
          <>
            {results!.authors.length > 0 && (
              <Section icon={<Users size={16} />} title="Matching authors">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {results!.authors.map((author) => (
                    <Link
                      key={author.id}
                      href={`/author/${author.username}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-200/70 p-3 transition hover:border-brand-200 hover:bg-brand-50/30"
                    >
                      <Avatar src={author.avatarUrl} name={author.name} size={40} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink-900">{author.name}</p>
                        <p className="truncate text-xs font-medium text-ink-400">
                          @{author.username} · {author._count.posts} article{author._count.posts === 1 ? '' : 's'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            )}

            {results!.jobs.length > 0 && (
              <Section
                icon={<Briefcase size={16} />}
                title="Matching jobs"
                seeAllHref={`/jobs?search=${encodeURIComponent(q)}`}
              >
                <JobGrid jobs={results!.jobs} />
              </Section>
            )}

            {results!.companies.length > 0 && (
              <Section
                icon={<Building2 size={16} />}
                title="Matching companies"
                seeAllHref={`/companies?search=${encodeURIComponent(q)}`}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results!.companies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
                </div>
              </Section>
            )}

            {results!.skills.length > 0 && (
              <Section icon={<Code2 size={16} />} title="Matching skills" seeAllHref="/skills">
                <div className="flex flex-wrap gap-2">
                  {results!.skills.map((skill) => (
                    <Link
                      key={skill.id}
                      href={`/skills/${skill.slug}`}
                      className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
                    >
                      {skill.name}
                      {skill._count && <span className="text-xs font-normal text-ink-400">{skill._count.jobs}</span>}
                    </Link>
                  ))}
                </div>
              </Section>
            )}

            {results!.developerResources.length > 0 && (
              <Section icon={<Wrench size={16} />} title="Matching resources" seeAllHref="/resources">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results!.developerResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </Section>
            )}

            <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
              <p className="mb-6 text-sm font-semibold text-ink-600">
                {results!.posts.length} article{results!.posts.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
              </p>
              <PostGrid posts={results!.posts} />
              {results!.posts.length > 0 && (
                <div className="mt-6 text-center">
                  <Link
                    href={`/blog?search=${encodeURIComponent(q)}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
                  >
                    See all matching articles <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {results!.posts.length === 0 &&
              results!.jobs.length === 0 &&
              results!.companies.length === 0 &&
              results!.skills.length === 0 &&
              results!.developerResources.length === 0 &&
              results!.authors.length === 0 && (
                <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
                  <p className="py-12 text-center text-base text-ink-400">
                    Nothing matched &ldquo;{q}&rdquo; anywhere on the platform.
                  </p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  seeAllHref,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  seeAllHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-500">
          <span className="text-brand-600">{icon}</span> {title}
        </h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            See all <ArrowRight size={13} />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
