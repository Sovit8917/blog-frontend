import type { Metadata } from "next";
import {
  listFeaturedPosts,
  listPosts,
  listCategories,
  listJobs,
  listMostRead,
  listSponsors,
  listReadingHistory,
  listForYou,
} from "@/lib/api";
import { getCurrentUser, getCookieHeader } from "@/lib/auth/session";
import { FeaturedHero } from "@/components/blog/FeaturedHero";
import { PostGrid } from "@/components/blog/PostGrid";
import { Sidebar } from "@/components/blog/Sidebar";
import { AdSlot } from "@/components/ads/AdSlot";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";
import { RelatedJobsStrip } from "@/components/home/RelatedJobsStrip";
import { TopicsGrid } from "@/components/home/TopicsGrid";
import { ForYou } from "@/components/home/ForYou";
import { MostReadWidget } from "@/components/home/MostReadWidget";
import { Pillars } from "@/components/home/Pillars";
import { ContinueReading } from "@/components/home/ContinueReading";
import { SponsorStrip } from "@/components/home/SponsorStrip";
import { buildListMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = buildListMetadata({
  title: "Tech Jobs, Career Content & Developer Resources",
  description:
    "Find your next tech job, level up your career, and learn from developer-focused writing — new stories, roles, and guides every week.",
  path: "/",
});

export const revalidate = 60;

export default async function HomePage() {
  const [featured, latest, categories, mostRead, jobs, sponsors, user] = await Promise.all([
    listFeaturedPosts(3).catch(() => ({
      items: [],
      meta: { nextCursor: null, hasMore: false, limit: 3 },
    })),
    listPosts({ sort: "latest", limit: 9 }).catch(() => ({
      items: [],
      meta: { nextCursor: null, hasMore: false, limit: 9 },
    })),
    listCategories().catch(() => []),
    listMostRead(7, 5).catch(() => []),
    listJobs({ limit: 3 }).catch(() => ({ items: [] })),
    listSponsors().catch(() => []),
    getCurrentUser().catch(() => null),
  ]);
  const safeCategories = Array.isArray(categories) ? categories : [];
  const mostReadItems = Array.isArray(mostRead) ? mostRead : [];
  const jobItems = Array.isArray(jobs?.items) ? jobs.items : [];
  const safeSponsors = Array.isArray(sponsors) ? sponsors : [];
  // Only fetched for signed-in visitors — reading history is an authed
  // endpoint, and there's nothing to show a signed-out visitor anyway.
  const history = user
    ? await listReadingHistory(10, getCookieHeader()).catch(() => [])
    : [];
  // The homepage "For You" rail previously always showed Most Read, even
  // for signed-in users — it never actually called the personalized feed.
  // Signed-in visitors now get GET /feed/for-you (follows + read signals);
  // signed-out visitors keep the Most Read fallback the backend itself uses
  // for brand-new accounts with no signal yet, so the section is never empty.
  const forYouItems = user
    ? await listForYou(8, getCookieHeader()).catch(() => mostReadItems)
    : mostReadItems;

  return (
    <>
      {/* POSITIONING — say what this site is for before anything else. */}
      <div className="border-b border-ink-100 bg-gradient-to-b from-brand-50/50 to-white">
        <div className="container-page py-10 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            Tech Jobs · Career Content · Developer Resources
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]">
            Build your career in tech — one good decision at a time.
          </h1>
          <p className="mt-3 max-w-xl text-ink-500">
            Real engineering roles, honest career advice, and writing for developers who want
            to grow — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Find a job <ArrowRight size={15} />
            </Link>
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 ring-1 ring-inset ring-ink-200 transition hover:bg-ink-50"
            >
              Browse Developer Resources
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page pt-8">
        <Pillars />
      </div>

      <div className="container-page mt-12">
        <FeaturedHero posts={featured.items} />
      </div>

      {history.length > 0 && (
        <div className="container-page mt-10">
          <ContinueReading entries={history} />
        </div>
      )}

      <div className="container-page mt-10">
        <AdSlot placement="HEADER" />
      </div>

      <div className="container-page mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-12">
          {/* INTEREST — quick jump into a category right under the hero. */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink-900">Latest stories</h2>
              <nav className="hidden gap-1 sm:flex">
                {safeCategories.slice(0, 4).map((c) => (
                  <Link
                    key={c.id}
                    href={`/category/${c.slug}`}
                    className="rounded-full px-3 py-1 text-xs font-medium text-ink-500 ring-1 ring-ink-200 transition hover:bg-ink-50 hover:text-ink-900"
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            </div>
            {/* READ — the main article feed. */}
            <PostGrid posts={latest.items.slice(0, 6)} priorityCount={3} />
          </div>

          {/* Most Read follows Latest — visitors see what's new first, then
              what the community has already validated. */}
          <MostReadWidget posts={mostReadItems} />

          {/* RELATED JOBS — inline in the reading flow, not just the sidebar. */}
          <RelatedJobsStrip jobs={jobItems} />

          {latest.items.length > 6 && <PostGrid posts={latest.items.slice(6)} />}

          {/* MONETIZATION — a second, distinct ad slot deeper in the feed
              (higher-intent scroll depth) plus the sponsor logo strip. */}
          <AdSlot placement="BETWEEN_POSTS" />
          <SponsorStrip sponsors={safeSponsors} />

          {/* ADVERTISE CTA — surfaces the monetization page to brands/employers
              browsing the site, not just readers. */}
          <Link
            href="/advertise"
            className="group flex flex-col items-start justify-between gap-3 rounded-2xl border border-ink-100 bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white transition hover:from-brand-700 hover:to-brand-600 sm:flex-row sm:items-center"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-300 group-hover:text-brand-100">
                For brands & employers
              </p>
              <p className="mt-1 text-lg font-bold">Advertise with us</p>
              <p className="mt-1 text-sm text-ink-300 group-hover:text-brand-50">
                Featured jobs, sponsored content, newsletter placements — with real analytics.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 transition group-hover:bg-white group-hover:text-brand-700">
              See partnership options <ArrowRight size={14} />
            </span>
          </Link>

          {/* PERSONALIZATION — the real ranked feed for signed-in visitors
              (follows + read signals), Most Read fallback when signed out. */}
          <div>
            <ForYou posts={forYouItems} isLoggedIn={Boolean(user)} />
            <div className="mt-4 text-right">
              <Link
                href="/for-you"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                See your full feed <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* FOLLOW TOPIC — the retention hook back to the homepage. */}
          <TopicsGrid categories={safeCategories} />
        </div>
        <Sidebar />
      </div>

      {/* RETURN — newsletter is the last, lowest-friction ask on the page. */}
      <div className="container-page">
        <NewsletterBanner />
      </div>
    </>
  );
}
