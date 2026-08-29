import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Briefcase, Clock, BadgeCheck, Laptop } from 'lucide-react';
import type { JobCard as JobCardType } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { timeAgo } from '@/lib/utils';
import { formatSalaryRange, EMPLOYMENT_TYPE_LABEL, REMOTE_TYPE_LABEL } from '@/lib/jobs/format';

/**
 * A scanning pass over a job card goes: is it featured → what's the role →
 * who's hiring → what does it pay → does the type/mode fit → skills match →
 * how fresh. Ordering and weight below follow that sequence — salary in
 * particular gets a same-line, same-weight treatment as the title instead
 * of being buried in a row of equally-styled pills.
 */
export function JobCard({ job }: { job: JobCardType }) {
  const salary = formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <article className="group relative flex flex-col gap-3 rounded-xl border border-ink-100 p-5 transition hover:border-brand-200 hover:shadow-md hover:shadow-ink-100/50">
      {job.isFeatured && (
        <span className="absolute right-5 top-5">
          <Badge variant="brand" className="font-semibold">Featured</Badge>
        </span>
      )}

      <Link href={`/jobs/${job.slug}`} className="pr-20">
        <h3 className="text-lg font-bold leading-snug text-ink-900 transition group-hover:text-brand-600">
          {job.title}
        </h3>
      </Link>

      <Link href={`/companies/${job.company.slug}`} className="flex w-fit items-center gap-2.5">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-ink-100">
          {job.company.logoUrl ? (
            <Image src={job.company.logoUrl} alt={job.company.name} fill className="object-cover" />
          ) : (
            <span className="text-xs font-bold text-ink-400">{job.company.name[0]}</span>
          )}
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-ink-600 hover:text-ink-900">
          {job.company.name}
          {job.company.isVerified && <BadgeCheck size={13} className="text-brand-500" />}
        </span>
      </Link>

      {/* Salary is the single most decision-relevant field, so it's the
          largest, boldest text on the card after the title. */}
      {salary && <p className="text-base font-bold text-emerald-700">{salary}</p>}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-500">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-ink-400" /> {job.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Laptop size={12} className="text-ink-400" /> {REMOTE_TYPE_LABEL[job.remoteType]}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase size={12} className="text-ink-400" /> {EMPLOYMENT_TYPE_LABEL[job.employmentType]}
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

      {job.publishedAt && (
        <p className="mt-1 flex items-center gap-1 border-t border-ink-50 pt-3 text-xs text-ink-400">
          <Clock size={12} /> Posted {timeAgo(job.publishedAt)}
        </p>
      )}
    </article>
  );
}
