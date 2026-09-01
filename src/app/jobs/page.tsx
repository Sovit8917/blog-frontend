import type { Metadata } from "next";
import { listJobs } from "@/lib/api";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobListRow } from "@/components/jobs/JobListRow";
import { RecentJobsWidget } from "@/components/jobs/RecentJobsWidget";
import { FollowUsWidget } from "@/components/jobs/FollowUsWidget";
import { TagCloudWidget } from "@/components/jobs/TagCloudWidget";
import { RecommendedJobsSection } from "@/components/jobs/RecommendedJobsSection";
import { SaveSearchAlertButton } from "@/components/jobs/SaveSearchAlertButton";
import { Pagination } from "@/components/ui/Pagination";
import { AdSlot } from "@/components/ads/AdSlot";
import { buildListMetadata } from "@/lib/seo/metadata";
import type { ListJobsParams } from "@/types";
import { SearchX } from "lucide-react";
import Link from "next/link";

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
  const currentPage = Math.max(1, Number(searchParams.page) || 1);
  const limit = 12;

  const params: ListJobsParams = {
    cursor: searchParams.cursor,
    page: currentPage,
    search: searchParams.search || undefined,
    location: searchParams.location || undefined,
    remoteType: (searchParams.remoteType as any) || undefined,
    employmentType: (searchParams.employmentType as any) || undefined,
    experienceLevel: (searchParams.experienceLevel as any) || undefined,
    skill: searchParams.skill || undefined,
    sort: (searchParams.sort as any) || undefined,
    limit,
  };

  const page = await listJobs(params);
  // Sidebar rail: sitewide newest jobs, independent of the current filters,
  // so it stays populated (and useful for discovery) on every filtered view.
  const recentJobs = await listJobs({ limit: 8, sort: "newest" }).catch(
    () => ({ items: [] as typeof page.items }),
  );
  // Tag cloud: top tags seen across the current + recent pages — cheap,
  // no dedicated tags endpoint needed.
  const tagCounts = new Map<string, number>();
  for (const j of [...page.items, ...recentJobs.items]) {
    for (const t of j.tags || []) tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
  }
  const tagCloud = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16)
    .map(([label]) => ({ label, href: `/jobs?search=${encodeURIComponent(label)}` }));

  const total = page.meta.total ?? (searchParams.total ? Number(searchParams.total) : undefined);
  const totalPages = total !== undefined ? Math.ceil(total / limit) : (page.meta.hasMore ? currentPage + 1 : currentPage);

  const paginationParams = {
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

        <AdSlot placement="HEADER" />

        {/* Only on the default, unfiltered first page — repeating a
            personalized row on every filtered/paginated view would be noise. */}
        {currentPage === 1 && !params.cursor && !hasActiveFilters && <RecommendedJobsSection />}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
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

            {/* ---- Blog-post-style job list — logo/banner left, tags +
                title + excerpt + author/date right, matching the
                jobcode.in layout ---- */}
            {page.items.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-ink-200 px-6 py-16 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-50 text-ink-400">
                  <SearchX size={22} />
                </span>
                <div>
                  <p className="font-semibold text-ink-800">No jobs match your filters</p>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">
                    {hasActiveFilters
                      ? "Try removing a filter or broadening your search — location and keyword tend to narrow results the most."
                      : "There aren't any open roles right now. Check back soon."}
                  </p>
                </div>
                {hasActiveFilters && (
                  <Link
                    href="/jobs"
                    className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-800"
                  >
                    Clear all filters
                  </Link>
                )}
              </div>
            ) : (
              <div>
                {page.items.map((job) => (
                  <JobListRow key={job.id} job={job} />
                ))}
              </div>
            )}

            <AdSlot placement="BETWEEN_POSTS" />

            <Pagination
              basePath="/jobs"
              params={paginationParams}
              page={currentPage}
              totalPages={totalPages}
            />
          </div>

          <aside className="flex flex-col gap-6">
            <div className="sticky top-24 space-y-6">
              <RecentJobsWidget jobs={recentJobs.items} />
              <FollowUsWidget />
              <TagCloudWidget tags={tagCloud} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

