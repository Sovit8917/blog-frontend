import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, SearchX } from "lucide-react";
import { listJobs } from "@/lib/api";
import { JobListRow } from "@/components/jobs/JobListRow";
import { RecentJobsWidget } from "@/components/jobs/RecentJobsWidget";
import { FollowUsWidget } from "@/components/jobs/FollowUsWidget";
import { TagCloudWidget } from "@/components/jobs/TagCloudWidget";
import { Pagination } from "@/components/ui/Pagination";
import { AdSlot } from "@/components/ads/AdSlot";
import { buildListMetadata, SITE } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd, jobListJsonLd } from "@/lib/seo/jsonld";
import type { ListJobsParams } from "@/types";

interface Props {
  searchParams: { page?: string; location?: string; skill?: string };
}

// This route is a dedicated, statically-describable SEO landing page for the
// "fresher jobs" search intent (distinct from /jobs?freshersOnly=true, which
// is just a filtered view of the general board) — its own URL, its own
// title/meta/FAQ/breadcrumb copy, so it can rank and be linked to directly
// from articles/resources targeting that keyword (see PostJob/ResourceJob
// editorial linking).
const TITLE = "Fresher Jobs — Entry-Level & Internship Openings";
const DESCRIPTION =
  "Browse fresher, entry-level, and internship jobs for recent graduates and first-time job seekers, updated daily from companies hiring now.";

export const metadata: Metadata = buildListMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/jobs/fresher",
});

export const revalidate = 60;

const FAQ = [
  {
    question: "What counts as a \"fresher\" job?",
    answer:
      "A fresher job is an internship or entry-level role aimed at candidates with little or no full-time work experience — typically recent graduates or first-time job seekers.",
  },
  {
    question: "Do I need prior experience to apply?",
    answer:
      "No. Fresher and entry-level roles are designed for candidates without full-time professional experience; internships in particular expect none.",
  },
  {
    question: "How often are new fresher jobs added?",
    answer:
      "Listings are pulled live from the job board and refresh continuously as companies post new openings, so check back regularly or set up a job alert.",
  },
];

export default async function FresherJobsPage({ searchParams }: Props) {
  const currentPage = Math.max(1, Number(searchParams.page) || 1);
  const limit = 12;

  const params: ListJobsParams = {
    page: currentPage,
    location: searchParams.location || undefined,
    skill: searchParams.skill || undefined,
    freshersOnly: true,
    sort: "newest",
    limit,
  };

  const page = await listJobs(params);
  const recentJobs = await listJobs({ freshersOnly: true, limit: 8, sort: "newest" }).catch(
    () => ({ items: [] as typeof page.items }),
  );

  const tagCounts = new Map<string, number>();
  for (const j of [...page.items, ...recentJobs.items]) {
    for (const t of j.tags || []) tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
  }
  const tagCloud = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16)
    .map(([label]) => ({ label, href: `/jobs/fresher?skill=${encodeURIComponent(label)}` }));

  const total = page.meta.total;
  const totalPages = total !== undefined ? Math.ceil(total / limit) : (page.meta.hasMore ? currentPage + 1 : currentPage);
  const paginationParams = { ...params, ...(total !== undefined ? { total } : {}) } as Record<
    string,
    string | number | undefined
  >;

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Jobs", url: `${SITE.url}/jobs` },
              { name: "Fresher Jobs", url: `${SITE.url}/jobs/fresher` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobListJsonLd(page.items)) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ)) }}
      />

      <div className="bg-slate-50/50 py-8 lg:py-12">
        <div className="container-page space-y-8">
          <nav className="flex items-center gap-2 text-xs font-medium text-ink-400">
            <Link href="/" className="transition hover:text-brand-600">Home</Link>
            <span className="text-ink-300">/</span>
            <Link href="/jobs" className="transition hover:text-brand-600">Jobs</Link>
            <span className="text-ink-300">/</span>
            <span className="text-ink-600">Fresher Jobs</span>
          </nav>

          <header className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
              <GraduationCap size={14} /> Freshers &amp; Interns
            </p>
            <h1 className="mt-1 font-serif text-3xl font-extrabold text-ink-950 sm:text-4xl">
              Fresher Jobs — Entry-Level &amp; Internship Openings
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-600">
              No experience, no problem. These roles are open to recent graduates,
              career-changers, and first-time job seekers — internships and
              entry-level positions only, updated as companies post them.
              Looking for something more senior?{" "}
              <Link href="/jobs" className="link-underline text-ink-800">
                Browse the full job board
              </Link>
              .
            </p>
          </header>

          <AdSlot placement="HEADER" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-500">
                  {total !== undefined ? (
                    <>
                      <span className="font-semibold text-ink-800">{total.toLocaleString()}</span>{" "}
                      {total === 1 ? "fresher job" : "fresher jobs"} found
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-ink-800">{page.items.length}</span>{" "}
                      jobs on this page
                    </>
                  )}
                </p>
                <Link
                  href="/jobs?freshersOnly=true"
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Refine with more filters →
                </Link>
              </div>

              {page.items.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-ink-200 px-6 py-16 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-50 text-ink-400">
                    <SearchX size={22} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink-800">No fresher jobs match right now</p>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">
                      Check back soon, or browse the full job board for other experience levels.
                    </p>
                  </div>
                  <Link
                    href="/jobs"
                    className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-800"
                  >
                    Browse all jobs
                  </Link>
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
                basePath="/jobs/fresher"
                params={paginationParams}
                page={currentPage}
                totalPages={totalPages}
              />

              {/* SEO copy block — targets long-tail "fresher jobs" / "entry level
                  jobs" queries with real, readable content rather than just a
                  filtered list, which is what a thin/duplicate-content page
                  (/jobs?freshersOnly=true) would otherwise be. */}
              <section className="space-y-4 border-t border-ink-100 pt-6">
                <h2 className="text-lg font-bold text-ink-900">Frequently asked questions</h2>
                <div className="space-y-4">
                  {FAQ.map((item) => (
                    <div key={item.question}>
                      <h3 className="font-semibold text-ink-800">{item.question}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
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
    </>
  );
}
