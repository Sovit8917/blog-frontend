import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Briefcase,
  Clock,
  BadgeCheck,
  Laptop,
  ArrowUpRight,
} from "lucide-react";
import type { JobCard as JobCardType } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { timeAgo, truncate, stripMarkdown } from "@/lib/utils";
import {
  formatSalaryRange,
  EMPLOYMENT_TYPE_LABEL,
  REMOTE_TYPE_LABEL,
  getJobCompany,
} from "@/lib/jobs/format";

/**
 * A scanning pass over a job card goes: what are the tags (freshers/trainee
 * etc) → who's hiring → what's the role → does the type/mode fit → does it
 * pay well → how fresh → apply. The layout below follows that sequence,
 * with a full-width logo/title header (like a job-board listing) and a
 * dedicated Apply button rather than relying on the whole card being a link.
 */
export function JobCard({ job }: { job: JobCardType }) {
  const company = getJobCompany(job);
  const salary = formatSalaryRange(
    job.salaryMin,
    job.salaryMax,
    job.salaryCurrency,
  );
  const excerpt = truncate(stripMarkdown(job.description || ""), 140);

  const bannerImage = job.images?.[0];

  return (
    <article className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-ink-100 bg-white transition hover:border-brand-200 hover:shadow-md hover:shadow-ink-100/50">
      {bannerImage && (
        <Link
          href={`/jobs/${job.slug}`}
          className="relative block aspect-[16/7] w-full overflow-hidden bg-ink-100"
        >
          <Image
            src={bannerImage}
            alt=""
            fill
            className="object-cover transition group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 400px"
          />
          {job.isFeatured && (
            <div className="absolute left-2.5 top-2.5 z-10">
              <span className="inline-flex items-center gap-1 rounded bg-ink-950/95 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm border border-white/10">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Featured
              </span>
            </div>
          )}
        </Link>
      )}

      <div className={`flex flex-col gap-3 p-5 ${bannerImage ? "pt-0" : ""}`}>
        <div className="flex items-start gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-100 ring-1 ring-ink-100">
            {company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={company.name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-base font-bold text-ink-400">
                {company.name[0]}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            {(job.tags && job.tags.length > 0) ||
            (!bannerImage && job.isFeatured) ||
            job.verificationStatus === "VERIFIED" ? (
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                {!bannerImage && job.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-ink-900/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm border border-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Featured
                  </span>
                )}
                {job.verificationStatus === "VERIFIED" && (
                  <Badge
                    variant="outline"
                    className="!ring-emerald-200/80 !text-emerald-700 bg-emerald-50/70"
                  >
                    <BadgeCheck size={11} className="text-emerald-600" />{" "}
                    Verified
                  </Badge>
                )}
                {job.tags?.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/jobs?search=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-95 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            ) : null}

            <Link href={`/jobs/${job.slug}`}>
              <h3 className="text-lg font-bold leading-snug text-ink-900 transition group-hover:text-brand-600">
                {job.title}
              </h3>
            </Link>

            {company.slug ? (
              <Link
                href={`/companies/${company.slug}`}
                className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-ink-600 hover:text-ink-900"
              >
                {company.name}
                {company.isVerified && (
                  <BadgeCheck size={13} className="text-brand-500" />
                )}
              </Link>
            ) : (
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-ink-600">
                {company.name}
              </span>
            )}
          </div>
        </div>

        {excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-500">
            {excerpt}
          </p>
        )}

        {/* Salary is the single most decision-relevant field, so it's the
          largest, boldest text on the card after the title. */}
        {salary && (
          <p className="text-base font-bold text-emerald-700">{salary}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-500">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-ink-400" /> {job.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Laptop size={12} className="text-ink-400" />{" "}
            {REMOTE_TYPE_LABEL[job.remoteType]}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={12} className="text-ink-400" />{" "}
            {EMPLOYMENT_TYPE_LABEL[job.employmentType]}
          </span>
        </div>

        {job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, 4).map(({ skill }) => (
              <Link key={skill.id} href={`/skills/${skill.slug}`}>
                <Badge variant="outline">{skill.name}</Badge>
              </Link>
            ))}
            {job.skills.length > 4 && (
              <span className="flex items-center px-1 text-xs font-medium text-ink-400">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="mt-1 flex items-center justify-between gap-3 border-t border-ink-50 pt-3">
          {job.publishedAt ? (
            <p className="flex items-center gap-1 text-xs text-ink-400">
              <Clock size={12} /> Posted {timeAgo(job.publishedAt)}
            </p>
          ) : (
            <span />
          )}
          <Link
            href={`/jobs/${job.slug}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            Apply Now <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
