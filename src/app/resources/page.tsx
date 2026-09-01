import type { Metadata } from 'next';
import { Wrench } from 'lucide-react';
import { listDeveloperResources } from '@/lib/api';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { OffsetPager } from '@/components/ui/OffsetPager';
import { AdSlot } from '@/components/ads/AdSlot';
import { buildListMetadata } from '@/lib/seo/metadata';
import type { ResourceType } from '@/types';

interface Props { searchParams: { search?: string; type?: ResourceType; page?: string } }

export const metadata: Metadata = buildListMetadata({
  title: 'Developer Resources',
  description: 'Curated tools, libraries, tutorials, courses, and docs — picked by the team, not auto-aggregated.',
  path: '/resources',
});

export const revalidate = 300;

const TYPE_FILTERS: { value: ResourceType | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'TOOL', label: 'Tools' },
  { value: 'LIBRARY', label: 'Libraries' },
  { value: 'TUTORIAL', label: 'Tutorials' },
  { value: 'COURSE', label: 'Courses' },
  { value: 'DOCUMENTATION', label: 'Docs' },
  { value: 'COMMUNITY', label: 'Community' },
];

export default async function ResourcesPage({ searchParams }: Props) {
  const search = searchParams.search?.trim() || undefined;
  const resourceType = searchParams.type;
  const page = Number(searchParams.page) || 1;

  const result = await listDeveloperResources({ search, resourceType, page, limit: 18 });

  return (
    <div className="bg-slate-50/50 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <header className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
            <Wrench size={14} /> Developer Resources
          </p>
          <h1 className="mt-1 font-serif text-3xl font-extrabold text-ink-950 sm:text-4xl">
            Tools, tutorials &amp; docs worth your time
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-600">
            A hand-picked catalog — not a scraped directory — of what our editors and authors
            actually reach for. Looking for jobs by technology instead?{' '}
            <a href="/skills" className="link-underline text-ink-800">
              Browse skills
            </a>
            .
          </p>
        </header>

        <AdSlot placement="HEADER" />

        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <form action="/resources" method="GET" className="max-w-md flex-1">
              {resourceType && <input type="hidden" name="type" value={resourceType} />}
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search resources…"
                className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </form>
            <div className="flex flex-wrap gap-2">
              {TYPE_FILTERS.map((f) => {
                const href = `/resources?${new URLSearchParams({
                  ...(search ? { search } : {}),
                  ...(f.value ? { type: f.value } : {}),
                }).toString()}`;
                const active = (resourceType ?? undefined) === f.value;
                return (
                  <a
                    key={f.label}
                    href={href}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'bg-slate-950 text-white'
                        : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
                    }`}
                  >
                    {f.label}
                  </a>
                );
              })}
            </div>
          </div>

          {result.items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink-200 py-16 text-center text-ink-400">
              No resources found{search ? ` for "${search}"` : ''}.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}

          <OffsetPager
            basePath="/resources"
            params={{ search, type: resourceType }}
            page={result.meta.page}
            totalPages={result.meta.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
