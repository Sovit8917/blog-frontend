import type { Metadata } from 'next';
import { listCompanies } from '@/lib/api';
import { CompanyGrid } from '@/components/companies/CompanyGrid';
import { OffsetPager } from '@/components/ui/OffsetPager';
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
    <div className="bg-slate-50/50 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <header className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Directory</p>
          <h1 className="mt-1 font-serif text-3xl font-extrabold text-ink-950 sm:text-4xl">Companies hiring</h1>
          <p className="mt-2 text-base leading-relaxed text-ink-600">Explore companies with open roles on the board.</p>
        </header>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm space-y-8">
          <form action="/companies" method="GET" className="max-w-md">
            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search companies…"
              className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
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
