import type { Metadata } from "next";
import { listJobs } from "@/lib/api";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobGrid } from "@/components/jobs/JobGrid";
import { RecommendedJobsSection } from "@/components/jobs/RecommendedJobsSection";
import { SaveSearchAlertButton } from "@/components/jobs/SaveSearchAlertButton";
import { LoadMoreLink } from "@/components/ui/LoadMoreLink";
import { buildListMetadata } from "@/lib/seo/metadata";
import type { ListJobsParams } from "@/types";

interface Props {
  searchParams: ListJobsParams & Record<string, string | undefined>;
}

export const metadata: Metadata = buildListMetadata({
  title: "Jobs",
  description:
    "Browse open engineering, design, and product roles from companies hiring now.",
  path: "/jobs",
});

export const revalidate = 60;

export default async function JobsPage({ searchParams }: Props) {
  const params: ListJobsParams = {
    cursor: searchParams.cursor,
    search: searchParams.search || undefined,
    location: searchParams.location || undefined,
    remoteType: (searchParams.remoteType as any) || undefined,
    employmentType: (searchParams.employmentType as any) || undefined,
    experienceLevel: (searchParams.experienceLevel as any) || undefined,
    skill: searchParams.skill || undefined,
    sort: (searchParams.sort as any) || undefined,
    limit: 12,
  };

  const page = await listJobs(params);

  // The API only runs the (relatively expensive) count() on the first page —
  // see jobs.service.ts — so on later pages `meta.total` is absent. Carry the
  // number forward as a query param instead of re-counting on every click.
  const total =
    page.meta.total ??
    (searchParams.total ? Number(searchParams.total) : undefined);
  const loadMoreParams = {
    ...params,
    ...(total !== undefined ? { total } : {}),
  } as Record<string, string | number | undefined>;
  const hasActiveFilters = Boolean(
    params.search ||
    params.location ||
    params.remoteType ||
    params.employmentType ||
    params.experienceLevel,
  );

  return (
    <div className="bg-slate-50/50 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <header className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Job board
          </p>
          <h1 className="mt-1 font-serif text-3xl font-extrabold text-ink-950 sm:text-4xl">
            Find your next role
          </h1>
          <p className="mt-2 text-base leading-relaxed text-ink-600">
            Open positions from companies building interesting things.
          </p>
        </header>

        {/* Only on the default, unfiltered first page — repeating a
            personalized row on every filtered/paginated view would be noise. */}
        {!params.cursor && !hasActiveFilters && <RecommendedJobsSection />}

        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <JobFilters params={params} />

          {/* Result count — sits right above the list so it's the first thing
              read after adjusting filters, confirming the search "took". */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-6">
            <p className="text-sm text-ink-500">
              {total !== undefined ? (
                <>
                  <span className="font-semibold text-ink-800">
                    {total.toLocaleString()}
                  </span>{" "}
                  {total === 1 ? "job" : "jobs"} found
                </>
              ) : (
                <>
                  <span className="font-semibold text-ink-800">
                    {page.items.length}
                  </span>{" "}
                  jobs on this page
                </>
              )}
            </p>
            <SaveSearchAlertButton params={params} />
          </div>

          <JobGrid jobs={page.items} hasActiveFilters={hasActiveFilters} />

          {page.meta.hasMore && page.meta.nextCursor && (
            <LoadMoreLink
              basePath="/jobs"
              params={loadMoreParams}
              cursor={page.meta.nextCursor}
            />
          )}
        </div>
      </div>
    </div>
  );
}
