import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { listTrendingPosts, listTags } from "@/lib/api";
import { AdSlot } from "@/components/ads/AdSlot";
import { Badge } from "@/components/ui/Badge";
import { readingTimeLabel } from "@/lib/utils";

/** Reusable right-rail: trending posts, tag cloud, sidebar ad — used on post + list pages. */
export async function Sidebar() {
  const [trending, tags] = await Promise.all([
    listTrendingPosts(5).catch(() => ({ items: [] })),
    listTags().catch(() => []),
  ]);
  // Defensive: guard against unexpected shapes the same way the .catch()
  // fallbacks above guard against outright failures.
  const trendingItems = Array.isArray(trending?.items) ? trending.items : [];
  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-md">
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
          <TrendingUp size={15} /> Trending now
        </h3>
        <ol className="space-y-4">
          {trendingItems.map((post, i) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group flex gap-3">
                <span className="text-base font-extrabold text-brand-500/40 transition group-hover:text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold leading-snug text-ink-900 transition group-hover:text-brand-600">
                    {post.title}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-ink-400">
                    {readingTimeLabel(post.readingTimeMins)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <AdSlot placement="SIDEBAR" />

      <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-md">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-600">
          Browse by tag
        </h3>
        <div className="flex flex-wrap gap-2">
          {safeTags.slice(0, 16).map((tag) => (
            <Link key={tag.id} href={`/tag/${tag.slug}`}>
              <Badge
                variant="outline"
                className="px-2.5 py-1 text-xs font-medium transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700"
              >
                #{tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
