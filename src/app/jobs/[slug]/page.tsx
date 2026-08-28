import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Briefcase, DollarSign, Clock, BadgeCheck, GraduationCap, Building2, Laptop } from 'lucide-react';
import { getJobBySlug, listJobsByCompany, myApplications, mySavedJobs } from '@/lib/api';
import { getCurrentUser, getCookieHeader } from '@/lib/auth/session';
import { ApplyJobButton } from '@/components/jobs/ApplyJobButton';
import { SaveJobButton } from '@/components/jobs/SaveJobButton';
import { Badge } from '@/components/ui/Badge';
import { JobGrid } from '@/components/jobs/JobGrid';
import { MarkdownContent } from '@/components/shared/MarkdownContent';
import { formatSalaryRange, EMPLOYMENT_TYPE_LABEL, EXPERIENCE_LEVEL_LABEL, REMOTE_TYPE_LABEL } from '@/lib/jobs/format';
import { buildListMetadata } from '@/lib/seo/metadata';
import { formatDate, timeAgo } from '@/lib/utils';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobBySlug(params.slug).catch(() => null);
  if (!job) return {};
  return buildListMetadata({
    title: job.seoTitle || `${job.title} at ${job.company.name}`,
    description: job.seoDescription || job.description.slice(0, 160),
    path: `/jobs/${job.slug}`,
    image: job.ogImageUrl,
  });
}

export const revalidate = 60;

export default async function JobDetailPage({ params }: Props) {
  const job = await getJobBySlug(params.slug).catch(() => null);
  if (!job) notFound();

  const user = await getCurrentUser();

  const [relatedJobs, savedJobs, applications] = await Promise.all([
    listJobsByCompany(job.company.slug, { limit: 4 }).catch(() => ({ items: [] as typeof job[] })),
    user ? mySavedJobs(getCookieHeader()).catch(() => []) : Promise.resolve([]),
    user ? myApplications(getCookieHeader()).catch(() => []) : Promise.resolve([]),
  ]);

  const isSaved = savedJobs.some((s) => s.jobId === job.id);
  const alreadyApplied = applications.some((a) => a.jobId === job.id);
  const otherCompanyJobs = relatedJobs.items.filter((j) => j.id !== job.id);
  const salary = formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency);

  const quickFacts: { label: string; value: string; icon?: React.ReactNode }[] = [
    { label: 'Company', value: job.company.name, icon: <Building2 size={14} /> },
    { label: 'Job role', value: job.title, icon: <Briefcase size={14} /> },
    ...(job.location ? [{ label: 'Location', value: job.location, icon: <MapPin size={14} /> }] : []),
    { label: 'Work mode', value: REMOTE_TYPE_LABEL[job.remoteType], icon: <Laptop size={14} /> },
    { label: 'Employment type', value: EMPLOYMENT_TYPE_LABEL[job.employmentType] },
    ...(job.experienceLevel
      ? [{ label: 'Experience level', value: EXPERIENCE_LEVEL_LABEL[job.experienceLevel], icon: <GraduationCap size={14} /> }]
      : []),
    ...(salary ? [{ label: 'Salary', value: salary, icon: <DollarSign size={14} /> }] : []),
    ...(job.publishedAt
      ? [{ label: 'Posted', value: formatDate(job.publishedAt), icon: <Clock size={14} /> }]
      : []),
  ];

  return (
    <div className="bg-slate-50/50 py-8 lg:py-12">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-10 shadow-sm">
            <header className="mb-8 border-b border-slate-100 pb-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {job.isFeatured && <Badge variant="brand" className="px-3 py-1 font-semibold">Featured</Badge>}
                <Badge variant="outline" className="px-2.5 py-1">{EMPLOYMENT_TYPE_LABEL[job.employmentType]}</Badge>
                <Badge variant="outline" className="px-2.5 py-1">{REMOTE_TYPE_LABEL[job.remoteType]}</Badge>
                {job.experienceLevel && <Badge variant="outline" className="px-2.5 py-1">{EXPERIENCE_LEVEL_LABEL[job.experienceLevel]}</Badge>}
              </div>

              <h1 className="font-serif text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">{job.title}</h1>

              <Link href={`/companies/${job.company.slug}`} className="mt-3 flex items-center gap-1.5 text-ink-600 transition hover:text-brand-600">
                <span className="font-semibold">{job.company.name}</span>
                {job.company.isVerified && <BadgeCheck size={16} className="text-brand-500" />}
              </Link>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-500">
                {job.location && (
                  <span className="flex items-center gap-1.5"><MapPin size={15} /> {job.location}</span>
                )}
                {salary && (
                  <span className="flex items-center gap-1.5"><DollarSign size={15} /> {salary}</span>
                )}
                {job.publishedAt && (
                  <span className="flex items-center gap-1.5"><Clock size={15} /> Posted {timeAgo(job.publishedAt)}</span>
                )}
                <span className="flex items-center gap-1.5"><Briefcase size={15} /> {job.applicationCount} applicants</span>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ApplyJobButton
                  jobId={job.id}
                  jobSlug={job.slug}
                  applyUrl={job.applyUrl}
                  allowInternalApply={job.allowInternalApply}
                  alreadyApplied={alreadyApplied}
                />
                <SaveJobButton jobId={job.id} initialSaved={isSaved} />
              </div>
            </header>

            {/* Quick-facts table */}
            <section className="not-prose mb-8 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-100/70 text-xs font-bold uppercase tracking-wider text-ink-600">
                      <th className="px-4 py-3">Particulars</th>
                      <th className="px-4 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickFacts.map((fact) => (
                      <QuickFactRow key={fact.label} icon={fact.icon} label={fact.label} value={fact.value} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Full write-up details */}
            <section className="not-prose overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/30">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  <DetailRow label="Description">
                    <MarkdownContent content={job.description} slugHeadings={false} />
                  </DetailRow>
                  {job.responsibilities && (
                    <DetailRow label="Responsibilities">
                      <MarkdownContent content={job.responsibilities} slugHeadings={false} />
                    </DetailRow>
                  )}
                  {job.requirements && (
                    <DetailRow label="Requirements">
                      <MarkdownContent content={job.requirements} slugHeadings={false} />
                    </DetailRow>
                  )}
                </tbody>
              </table>
            </section>

            {job.skills.length > 0 && (
              <section className="mt-8 border-t border-slate-100 pt-6">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-600">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(({ skill }) => (
                    <Link key={skill.id} href={`/skills/${skill.slug}`}>
                      <Badge variant="brand" className="px-3 py-1 text-xs font-semibold">{skill.name}</Badge>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-600">About {job.company.name}</h3>
                <Link href={`/companies/${job.company.slug}`} className="text-sm font-semibold text-brand-600 link-underline">
                  View company profile →
                </Link>
              </div>

              {otherCompanyJobs.length > 0 && (
                <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-600">
                    More at {job.company.name}
                  </h3>
                  <JobGrid jobs={otherCompanyJobs} />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function QuickFactRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <tr className="border-b border-ink-100 last:border-0 even:bg-ink-50/60">
      <th className="w-1/3 whitespace-nowrap px-4 py-3 align-top font-semibold text-ink-900">
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
      </th>
      <td className="px-4 py-3 text-ink-700">{value}</td>
    </tr>
  );
}

/**
 * One labelled row of the full write-up table (Description / Responsibilities
 * / Requirements). Rendered as `block` below `sm` — a real 2-column table
 * with long-form markdown in the value cell gets cramped on narrow screens,
 * so the label sits above its content there instead of squeezed beside it.
 */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="block border-b border-ink-100 py-4 align-top last:border-0 even:bg-ink-50/40 sm:table-row sm:py-0">
      <th className="block w-full px-4 pb-2 text-left align-top font-semibold text-ink-900 sm:table-cell sm:w-48 sm:whitespace-nowrap sm:py-4">
        {label}
      </th>
      <td className="block px-4 text-ink-700 sm:table-cell sm:py-4">{children}</td>
    </tr>
  );
}
