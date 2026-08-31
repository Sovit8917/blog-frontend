import Link from "next/link";
import Image from "next/image";
import { MapPin, BadgeCheck, ArrowUpRight } from "lucide-react";
import type { JobCard as JobCardType } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/utils";
import {
  formatSalaryRange,
  EMPLOYMENT_TYPE_LABEL,
  REMOTE_TYPE_LABEL,
  getJobCompany,
} from "@/lib/jobs/format";

/**
 * One row of the desktop/tablet jobs table. Mirrors the data shown in
 * `JobCard` (the mobile fallback) so switching layouts at the `md`
 * breakpoint never drops information.
 */
export function JobRow({ job }: { job: JobCardType }) {
  const company = getJobCompany(job);
  const salary = formatSalaryRange(
    job.salaryMin,
    job.salaryMax,
    job.salaryCurrency,
  );

  return (
    <tr className="border-b border-ink-100 align-top transition last:border-0 hover:bg-ink-50/60">
      <td className="max-w-[360px] px-4 py-4">
        <div className="flex items-start gap-3">
          {company.slug ? (
            <Link
              href={`/companies/${company.slug}`}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-100"
            >
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-ink-400">
                  {company.name[0]}
                </span>
              )}
            </Link>
          ) : (
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-100">
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-ink-400">
                  {company.name[0]}
                </span>
              )}
            </div>
          )}
          <div className="min-w-0">
            {(job.tags && job.tags.length > 0) || job.isFeatured ? (
              <div className="mb-1 flex flex-wrap gap-1">
                {job.isFeatured && (
                  <Badge variant="dark" className="text-[10px]">
                    Featured
                  </Badge>
                )}
                {job.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="dark" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
            <Link href={`/jobs/${job.slug}`} className="group">
              <p className="truncate font-semibold text-ink-900 group-hover:text-brand-600">
                {job.title}
              </p>
            </Link>
            {company.slug ? (
              <Link
                href={`/companies/${company.slug}`}
                className="mt-0.5 flex items-center gap-1 truncate text-xs font-medium text-ink-500 hover:text-ink-700"
              >
                {company.name}
                {company.isVerified && (
                  <BadgeCheck size={12} className="shrink-0 text-brand-500" />
                )}
              </Link>
            ) : (
              <span className="mt-0.5 flex items-center gap-1 truncate text-xs font-medium text-ink-500">
                {company.name}
              </span>
            )}
            {job.skills.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {job.skills.slice(0, 3).map(({ skill }) => (
                  <Badge
                    key={skill.id}
                    variant="outline"
                    className="text-[11px]"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-ink-600">
        {job.location ? (
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0 text-ink-400" />{" "}
            {job.location}
          </span>
        ) : (
          <span className="text-ink-300">—</span>
        )}
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-600">
            {EMPLOYMENT_TYPE_LABEL[job.employmentType]}
          </span>
          <span className="w-fit rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-600">
            {REMOTE_TYPE_LABEL[job.remoteType]}
          </span>
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        {salary ? (
          <span className="font-medium text-emerald-700">{salary}</span>
        ) : (
          <span className="text-ink-300">—</span>
        )}
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-ink-400">
        {job.publishedAt ? timeAgo(job.publishedAt) : "—"}
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-right">
        <Link
          href={`/jobs/${job.slug}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-ink-800"
        >
          Apply Now <ArrowUpRight size={14} />
        </Link>
      </td>
    </tr>
  );
}
