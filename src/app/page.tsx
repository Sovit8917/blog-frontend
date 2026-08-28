import type { Metadata } from "next";
import { listFeaturedPosts, listPosts, listCategories } from "@/lib/api";
import { FeaturedHero } from "@/components/blog/FeaturedHero";
import { PostGrid } from "@/components/blog/PostGrid";
import { Sidebar } from "@/components/blog/Sidebar";
import { AdSlot } from "@/components/ads/AdSlot";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";
import { buildListMetadata, SITE } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata: Metadata = buildListMetadata({
  title: "Latest Stories",
  description:
    "Thoughtful writing on the things worth thinking about — new essays every week.",
  path: "/",
});

export const revalidate = 60;

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    listFeaturedPosts(3).catch(() => ({
      items: [],
      meta: { nextCursor: null, hasMore: false, limit: 3 },
    })),
    listPosts({ sort: "latest", limit: 9 }).catch(() => ({
      items: [],
      meta: { nextCursor: null, hasMore: false, limit: 9 },
    })),
    listCategories().catch(() => []),
  ]);
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <>
      <div className="container-page pt-8">
        <FeaturedHero posts={featured.items} />
      </div>

      <div className="container-page mt-14">
        <AdSlot placement="HEADER" />
      </div>

      <div className="container-page mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
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
          <PostGrid posts={latest.items} priorityCount={3} />
        </div>
        <Sidebar />
      </div>

      <div className="container-page">
        <NewsletterBanner />
      </div>
    </>
  );
}
