import type { Metadata } from 'next';
import { listCompanies } from '@/lib/api';
import { CompanyGrid } from '@/components/companies/CompanyGrid';
import { OffsetPager } from '@/components/ui/OffsetPager';
import { AdSlot } from '@/components/ads/AdSlot';
import { buildListMetadata } from '@/lib/seo/metadata';

interface Props { searchParams: { search?: string; page?: string } }

export const metadata: Metadata = buildListMetadata({
  title: 'Companies',
  description: 'Browse companies hiring on the job board.',
  path: '/companies',
});

export const revalidate = 300;

export default async function CompaniesPage({ searchParams }: Props) {
  const search = searchParams.search?.trim() || undefined;
  const page = Number(searchParams.page) || 1;
  const result = await listCompanies({ search, page, limit: 12 });

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <header className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Directory</p>
          <h1 className="mt-1 font-serif text-3xl font-extrabold text-ink-950 dark:text-ink-50 sm:text-4xl">Companies hiring</h1>
          <p className="mt-2 text-base leading-relaxed text-ink-600 dark:text-ink-400">Explore companies with open roles on the board.</p>
        </header>

        <AdSlot placement="HEADER" />

        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 sm:p-8 shadow-sm space-y-8">
          <form action="/companies" method="GET" className="max-w-md">
            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search companies…"
              className="w-full rounded-full border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm outline-none placeholder:text-ink-400 dark:placeholder:text-ink-500 focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
            />
          </form>

          <CompanyGrid companies={result.items} />

          <OffsetPager
            basePath="/companies"
            params={{ search }}
            page={result.meta.page}
            totalPages={result.meta.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
