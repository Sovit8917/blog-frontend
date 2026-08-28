import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Briefcase, Clock, BadgeCheck } from 'lucide-react';
import type { JobCard as JobCardType } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { timeAgo } from '@/lib/utils';
import { formatSalaryRange, EMPLOYMENT_TYPE_LABEL, REMOTE_TYPE_LABEL } from '@/lib/jobs/format';

export function JobCard({ job }: { job: JobCardType }) {
  return (
    <article className="group flex flex-col gap-3 rounded-xl border border-ink-100 p-5 transition hover:border-brand-200 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/companies/${job.company.slug}`} className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-100">
            {job.company.logoUrl ? (
              <Image src={job.company.logoUrl} alt={job.company.name} fill className="object-cover" />
            ) : (
              <span className="text-sm font-bold text-ink-400">{job.company.name[0]}</span>
            )}
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-ink-700">
              {job.company.name}
              {job.company.isVerified && <BadgeCheck size={14} className="text-brand-500" />}
            </p>
            {job.location && (
              <p className="flex items-center gap-1 text-xs text-ink-400">
                <MapPin size={12} /> {job.location}
              </p>
            )}
          </div>
        </Link>
        {job.isFeatured && <Badge variant="brand">Featured</Badge>}
      </div>

      <Link href={`/jobs/${job.slug}`}>
        <h3 className="text-lg font-semibold leading-snug text-ink-900 transition group-hover:text-brand-600">
          {job.title}
        </h3>
      </Link>

      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
        <span className="flex items-center gap-1 rounded-full bg-ink-50 px-2.5 py-1">
          <Briefcase size={12} /> {EMPLOYMENT_TYPE_LABEL[job.employmentType]}
        </span>
        <span className="rounded-full bg-ink-50 px-2.5 py-1">{REMOTE_TYPE_LABEL[job.remoteType]}</span>
        {formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency) && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
            {formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </span>
        )}
      </div>

      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map(({ skill }) => (
            <Link key={skill.id} href={`/skills/${skill.slug}`}>
              <Badge variant="outline">{skill.name}</Badge>
            </Link>
          ))}
        </div>
      )}

      {job.publishedAt && (
        <p className="flex items-center gap-1 text-xs text-ink-400">
          <Clock size={12} /> Posted {timeAgo(job.publishedAt)}
        </p>
      )}
    </article>
  );
}
