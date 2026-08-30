import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  BadgeCheck,
  GraduationCap,
  Building2,
  Laptop,
  Users,
  ExternalLink,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { getJobBySlug, getCompanyBySlug, listJobsByCompany, myApplications, mySavedJobs } from '@/lib/api';
import { getCurrentUser, getCookieHeader } from '@/lib/auth/session';
import { ApplyJobButton } from '@/components/jobs/ApplyJobButton';
import { SaveJobButton } from '@/components/jobs/SaveJobButton';
import { Badge } from '@/components/ui/Badge';
import { JobGrid } from '@/components/jobs/JobGrid';
import { MarkdownContent } from '@/components/shared/MarkdownContent';
import { formatSalaryRange, EMPLOYMENT_TYPE_LABEL, EXPERIENCE_LEVEL_LABEL, REMOTE_TYPE_LABEL } from '@/lib/jobs/format';
import { buildListMetadata, SITE } from '@/lib/seo/metadata';
import { ShareButton } from '@/components/shared/ShareButton';
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

  const [relatedJobs, company, savedJobs, applications] = await Promise.all([
    listJobsByCompany(job.company.slug, { limit: 4 }).catch(() => ({ items: [] as typeof job[] })),
    getCompanyBySlug(job.company.slug).catch(() => null),
    user ? mySavedJobs(getCookieHeader()).catch(() => []) : Promise.resolve([]),
    user ? myApplications(getCookieHeader()).catch(() => []) : Promise.resolve([]),
  ]);

  const isSaved = savedJobs.some((s) => s.jobId === job.id);
  const alreadyApplied = applications.some((a) => a.jobId === job.id);
  const otherCompanyJobs = relatedJobs.items.filter((j) => j.id !== job.id);
  const salary = formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency);
  const isExternalOnly = !job.allowInternalApply && !!job.applyUrl;
  const jobUrl = `${SITE.url}/jobs/${job.slug}`;

  // Facts shown in the info grid — salary gets its own hero treatment above,
  // so it's deliberately left out here to avoid saying the same thing twice.
  const infoFacts: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'Work mode', value: REMOTE_TYPE_LABEL[job.remoteType], icon: <Laptop size={17} /> },
    { label: 'Employment type', value: EMPLOYMENT_TYPE_LABEL[job.employmentType], icon: <Briefcase size={17} /> },
    ...(job.location ? [{ label: 'Location', value: job.location, icon: <MapPin size={17} /> }] : []),
    ...(job.experienceLevel
      ? [{ label: 'Experience', value: EXPERIENCE_LEVEL_LABEL[job.experienceLevel], icon: <GraduationCap size={17} /> }]
      : []),
    ...(job.publishedAt
      ? [{ label: 'Posted', value: timeAgo(job.publishedAt), icon: <Clock size={17} /> }]
      : []),
    { label: 'Applicants', value: `${job.applicationCount}`, icon: <Users size={17} /> },
  ];

  return (
    <div className="bg-slate-50/50 pb-28 pt-8 lg:pb-12 lg:pt-12">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
          <div>
            {/* ---- Header: identity, then the decision-relevant facts, then the CTA ---- */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
              <header>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {job.isFeatured && <Badge variant="brand" className="px-3 py-1 font-semibold">Featured</Badge>}
                  <Badge variant="outline" className="px-2.5 py-1">{EMPLOYMENT_TYPE_LABEL[job.employmentType]}</Badge>
                  <Badge variant="outline" className="px-2.5 py-1">{REMOTE_TYPE_LABEL[job.remoteType]}</Badge>
                  {job.experienceLevel && <Badge variant="outline" className="px-2.5 py-1">{EXPERIENCE_LEVEL_LABEL[job.experienceLevel]}</Badge>}
                </div>

                <h1 className="font-serif text-3xl font-extrabold tracking-tight text-ink-950 sm:text-[2.5rem] sm:leading-tight">
                  {job.title}
                </h1>

                <Link
                  href={`/companies/${job.company.slug}`}
                  className="mt-3 flex w-fit items-center gap-2 text-ink-600 transition hover:text-brand-600"
                >
                  {job.company.logoUrl ? (
                    <Image
                      src={job.company.logoUrl}
                      alt=""
                      width={24}
                      height={24}
                      className="h-6 w-6 shrink-0 rounded-md object-contain ring-1 ring-inset ring-ink-100"
                    />
                  ) : (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink-100 text-ink-400">
                      <Building2 size={13} />
                    </span>
                  )}
                  <span className="font-semibold">{job.company.name}</span>
                  {job.company.isVerified && <BadgeCheck size={16} className="text-brand-500" />}
                </Link>

                {job.location && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
                    <MapPin size={14} /> {job.location}
                  </p>
                )}
              </header>

              {/* Ultra-clean inline salary badge */}
              {salary && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-sm font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    <DollarSign size={15} />
                    {salary}
                  </span>
                </div>
              )}

              {/* Desktop apply row — hidden on mobile in favor of the sticky bar. */}
              <div className="mt-6 hidden gap-3 sm:flex">
                <ApplyJobButton
                  jobId={job.id}
                  jobSlug={job.slug}
                  applyUrl={job.applyUrl}
                  allowInternalApply={job.allowInternalApply}
                  alreadyApplied={alreadyApplied}
                />
                <SaveJobButton jobId={job.id} initialSaved={isSaved} />
                <ShareButton url={jobUrl} title={`${job.title} at ${job.company.name}`} contentType="job" jobId={job.id} />
              </div>

              {/* Application-method messaging — makes it explicit up front whether
                  applying happens here or on the employer's own site. */}
              <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
                {isExternalOnly ? (
                  <>
                    <ExternalLink size={13} />
                    You'll be taken to {job.company.name}'s own site to finish applying.
                  </>
                ) : (
                  <>
                    <ShieldCheck size={13} />
                    Apply directly — your profile and resume are sent straight to {job.company.name}.
                  </>
                )}
              </p>
            </div>

            {/* ---- Info grid: replaces the old quick-facts table with scannable cards ---- */}
            <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {infoFacts.map((fact) => (
                <InfoCard key={fact.label} icon={fact.icon} label={fact.label} value={fact.value} />
              ))}
            </section>

            {/* ---- Full write-up ---- */}
            <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
              <section>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-600">Description</h2>
                <MarkdownContent content={job.description} slugHeadings={false} />
              </section>

              {job.responsibilities && (
                <section className="mt-8 border-t border-slate-100 pt-6">
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-600">Responsibilities</h2>
                  <MarkdownContent content={job.responsibilities} slugHeadings={false} />
                </section>
              )}

              {job.requirements && (
                <section className="mt-8 border-t border-slate-100 pt-6">
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-600">Requirements</h2>
                  <MarkdownContent content={job.requirements} slugHeadings={false} />
                </section>
              )}

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
          </div>

          <aside className="flex flex-col gap-6">
            <div className="sticky top-24 space-y-6">
              {/* ---- Stronger company card ---- */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 p-6">
                  {job.company.logoUrl ? (
                    <Image
                      src={job.company.logoUrl}
                      alt={job.company.name}
                      width={52}
                      height={52}
                      className="h-13 w-13 shrink-0 rounded-xl object-contain ring-1 ring-inset ring-ink-100"
                    />
                  ) : (
                    <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Building2 size={22} />
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate font-serif text-lg font-bold text-ink-950">{job.company.name}</h3>
                      {job.company.isVerified && <BadgeCheck size={16} className="shrink-0 text-brand-500" />}
                    </div>
                    {company?.location && (
                      <p className="flex items-center gap-1 truncate text-xs text-ink-500">
                        <MapPin size={12} /> {company.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  {company?.description && (
                    <p className="line-clamp-4 text-sm leading-relaxed text-ink-600">{company.description}</p>
                  )}

                  <dl className="space-y-2.5 text-sm">
                    {company?._count && (
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-1.5 text-ink-500">
                          <Briefcase size={14} /> Open roles
                        </dt>
                        <dd className="font-semibold text-ink-900">{company._count.jobs}</dd>
                      </div>
                    )}
                    {company?.website && (
                      <div className="flex items-center justify-between gap-2">
                        <dt className="flex items-center gap-1.5 text-ink-500">
                          <Globe size={14} /> Website
                        </dt>
                        <dd className="truncate">
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="font-semibold text-brand-600 hover:underline"
                          >
                            {company.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>

                  <Link
                    href={`/companies/${job.company.slug}`}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-ink-50 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-100"
                  >
                    View company profile →
                  </Link>
                </div>
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

      {/* ---- Sticky mobile apply bar ---- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur sm:hidden">
        <div className="flex items-center gap-2">
          {/* Always show company context here, not just when a salary is
              disclosed — otherwise an undisclosed-salary job left the bar
              with nothing but two buttons and no reminder of what the
              candidate is about to apply to. */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink-900">{salary || job.title}</p>
            <p className="truncate text-xs text-ink-500">{job.company.name}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SaveJobButton jobId={job.id} initialSaved={isSaved} />
            <ApplyJobButton
              jobId={job.id}
              jobSlug={job.slug}
              applyUrl={job.applyUrl}
              allowInternalApply={job.allowInternalApply}
              alreadyApplied={alreadyApplied}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <p className="truncate text-sm font-semibold text-ink-900">{value}</p>
      </div>
    </div>
  );
}
