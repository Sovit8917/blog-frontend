import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase } from "lucide-react";
import type { PostCard as PostCardType, JobCard as JobCardType } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, readingTimeLabel } from "@/lib/utils";
import { JobListRow } from "@/components/jobs/JobListRow";
import { PostCard } from "./PostCard";

/** Homepage hero: one main featured story + jobs card underneath + 2 secondary stories beside it. */
export function FeaturedHero({
  posts,
  jobs = [],
}: {
  posts: PostCardType[];
  jobs?: JobCardType[];
}) {
  const [main, ...rest] = Array.isArray(posts) ? posts : [];
  if (!main) return null;

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-2 flex flex-col gap-6">
        <Link
          href={`/blog/${main.slug}`}
          className="group relative block overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs transition hover:border-slate-300 hover:shadow-md"
        >
          {main.coverImageUrl && (
            <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={main.coverImageUrl}
                alt={main.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
          )}

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              {main.category && (
                <Badge variant="brand">{main.category.name}</Badge>
              )}
              {main.isSponsored && <Badge variant="sponsor">Sponsored</Badge>}
              {main.publishedAt && (
                <span className="text-xs text-ink-400">
                  {formatDate(main.publishedAt)}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold tracking-tight text-ink-950 sm:text-2xl group-hover:text-brand-600 transition">
              {main.title}
            </h2>

            {main.excerpt && (
              <p className="line-clamp-2 text-sm leading-relaxed text-ink-500">
                {main.excerpt}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2.5">
                <Avatar
                  src={main.author.avatarUrl}
                  name={main.author.name}
                  size={28}
                />
                <span className="text-sm font-semibold text-ink-700">
                  {main.author.name}
                </span>
              </div>
              <span className="text-xs text-ink-400">
                {readingTimeLabel(main.readingTimeMins)}
              </span>
            </div>
          </div>
        </Link>

        {/* Featured Jobs list under the hero story */}
        {jobs.length > 0 && (
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                  <Briefcase size={14} />
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-600">
                  Featured Opportunities
                </h3>
              </div>
              <Link
                href="/jobs"
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                View job board <ArrowRight size={13} />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {jobs.slice(0, 3).map((job) => (
                <JobListRow key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {rest.slice(0, 2).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
