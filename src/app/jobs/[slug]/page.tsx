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
import { getJobBySlug, getCompanyBySlug, listJobsByCompany, listJobs, myApplications, mySavedJobs } from '@/lib/api';
import { RecentJobsWidget } from '@/components/jobs/RecentJobsWidget';
import { getCurrentUser, getCookieHeader } from '@/lib/auth/session';
import { ApplyJobButton } from '@/components/jobs/ApplyJobButton';
import { SaveJobButton } from '@/components/jobs/SaveJobButton';
import { Badge } from '@/components/ui/Badge';
import { JobGrid } from '@/components/jobs/JobGrid';
import { MarkdownContent } from '@/components/shared/MarkdownContent';
import { formatSalaryRange, EMPLOYMENT_TYPE_LABEL, EXPERIENCE_LEVEL_LABEL, REMOTE_TYPE_LABEL, getJobCompany } from '@/lib/jobs/format';
import { buildListMetadata, SITE } from '@/lib/seo/metadata';
import { ShareButton } from '@/components/shared/ShareButton';
import { JobGallery } from '@/components/jobs/JobGallery';
import { AdSlot } from '@/components/ads/AdSlot';
import { formatDate } from '@/lib/utils';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobBySlug(params.slug).catch(() => null);
  if (!job) return {};
  return buildListMetadata({
    title: job.seoTitle || `${job.title} at ${getJobCompany(job).name}`,
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
  const company = getJobCompany(job);

  const [relatedJobs, companyProfile, savedJobs, applications, recentJobs] = await Promise.all([
    company.slug ? listJobsByCompany(company.slug, { limit: 4 }).catch(() => ({ items: [] as typeof job[] })) : Promise.resolve({ items: [] as typeof job[] }),
    company.slug ? getCompanyBySlug(company.slug).catch(() => null) : Promise.resolve(null),
    user ? mySavedJobs(getCookieHeader()).catch(() => []) : Promise.resolve([]),
    user ? myApplications(getCookieHeader()).catch(() => []) : Promise.resolve([]),
    // Sitewide "Recent Jobs" rail — independent of this job's company, shown
    // on every job page so it always has content (unlike "More at company").
    listJobs({ limit: 8, sort: 'newest' }).catch(() => ({ items: [] as typeof job[] })),
  ]);

  const isSaved = savedJobs.some((s) => s.jobId === job.id);
  const alreadyApplied = applications.some((a) => a.jobId === job.id);
  const otherCompanyJobs = relatedJobs.items.filter((j) => j.id !== job.id);
  const salary = formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency);
  const isExternalOnly = !job.allowInternalApply && !!job.applyUrl;
  const jobUrl = `${SITE.url}/jobs/${job.slug}`;

  // Facts shown in the info table — a plain label/value table (like a
  // typical job-board "highlights" table) scans faster than a card grid,
  // and mirrors the structured layout candidates are used to seeing.
  // Salary gets its own hero treatment above, so it's left out here to
  // avoid saying the same thing twice.
  // Facts shown in the info table — mirrors the jobcode.in "Job Details /
  // Information" table structure: Job Title, Role, Company, Job ID,
  // Location, Category, Experience, Employment Type, Posted Date, plus any
  // freeform additionalDetails rows the poster added (Database Skills,
  // Version Control, etc.). Salary gets its own hero treatment above, so
  // it's left out here to avoid saying the same thing twice. Applicants is
  // only shown for jobs that actually take internal applications — an
  // external-only job's "0 applicants" is meaningless (we never see them).
  const infoFacts: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'Job Title', value: job.title, icon: <Briefcase size={17} /> },
    ...(job.role ? [{ label: 'Role', value: job.role, icon: <Briefcase size={17} /> }] : []),
    { label: 'Company', value: company.name, icon: <Building2 size={17} /> },
    ...(job.externalJobId ? [{ label: 'Job ID', value: job.externalJobId, icon: <BadgeCheck size={17} /> }] : []),
    ...(job.location ? [{ label: 'Location', value: job.location, icon: <MapPin size={17} /> }] : []),
    ...(job.category ? [{ label: 'Category', value: job.category, icon: <Building2 size={17} /> }] : []),
    ...(job.experienceLevel
      ? [{ label: 'Experience', value: EXPERIENCE_LEVEL_LABEL[job.experienceLevel], icon: <GraduationCap size={17} /> }]
      : []),
    { label: 'Employment Type', value: EMPLOYMENT_TYPE_LABEL[job.employmentType], icon: <Briefcase size={17} /> },
    { label: 'Work Mode', value: REMOTE_TYPE_LABEL[job.remoteType], icon: <Laptop size={17} /> },
    ...(job.skills.length > 0
      ? [{ label: 'Primary Skill', value: job.skills.map(({ skill }) => skill.name).join(', '), icon: <GraduationCap size={17} /> }]
      : []),
    ...(job.additionalDetails || []).map((d) => ({ label: d.label, value: d.value, icon: <BadgeCheck size={17} /> })),
    ...(job.publishedAt
      ? [{ label: 'Posted Date', value: formatDate(job.publishedAt), icon: <Clock size={17} /> }]
      : []),
    ...(!isExternalOnly ? [{ label: 'Applicants', value: `${job.applicationCount}`, icon: <Users size={17} /> }] : []),
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
                  {job.tags?.map((tag) => (
                    <Badge key={tag} variant="dark" className="px-2.5 py-1">{tag}</Badge>
                  ))}
                  <Badge variant="outline" className="px-2.5 py-1">{EMPLOYMENT_TYPE_LABEL[job.employmentType]}</Badge>
                  <Badge variant="outline" className="px-2.5 py-1">{REMOTE_TYPE_LABEL[job.remoteType]}</Badge>
                  {job.experienceLevel && <Badge variant="outline" className="px-2.5 py-1">{EXPERIENCE_LEVEL_LABEL[job.experienceLevel]}</Badge>}
                </div>

                <h1 className="font-serif text-3xl font-extrabold tracking-tight text-ink-950 sm:text-[2.5rem] sm:leading-tight">
                  {job.title}
                </h1>

                {company.slug ? (
                  <Link
                    href={`/companies/${company.slug}`}
                    className="mt-3 flex w-fit items-center gap-2 text-ink-600 transition hover:text-brand-600"
                  >
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
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
                    <span className="font-semibold">{company.name}</span>
                    {company.isVerified && <BadgeCheck size={16} className="text-brand-500" />}
                  </Link>
                ) : (
                  <div className="mt-3 flex w-fit items-center gap-2 text-ink-600">
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
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
                    <span className="font-semibold">{company.name}</span>
                  </div>
                )}

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

              {/* ---- Featured image — the single lead visual for the role, shown
                  right under the title like a job-board banner. Only the extra
                  photos (if more than one) get the fuller gallery further down. */}
              {job.images && job.images.length > 0 && job.images[0] && (
                <div className="relative mt-6 aspect-[1200/628] w-full overflow-hidden rounded-xl bg-ink-100 ring-1 ring-inset ring-ink-100">
                  <Image
                    src={job.images[0]}
                    alt={job.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 700px"
                  />
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
                <ShareButton url={jobUrl} title={`${job.title} at ${company.name}`} contentType="job" jobId={job.id} />
              </div>

              {/* Application-method messaging — makes it explicit up front whether
                  applying happens here or on the employer's own site. */}
              <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
                {isExternalOnly ? (
                  <>
                    <ExternalLink size={13} />
                    You'll be taken to {company.name}'s own site to finish applying.
                  </>
                ) : (
                  <>
                    <ShieldCheck size={13} />
                    Apply directly — your profile and resume are sent straight to {company.name}.
                  </>
                )}
              </p>

              {/* ---- Info table: scannable "Job Details / Information" style table ---- */}
              <section className="mt-6 overflow-hidden rounded-xl border border-slate-200/80 shadow-sm">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-brand-50">
                      <th scope="col" className="border-b border-slate-200 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-brand-700">
                        Job Details
                      </th>
                      <th scope="col" className="border-b border-slate-200 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-brand-700">
                        Information
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {infoFacts.map((fact, i) => (
                      <tr
                        key={fact.label}
                        className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                      >
                        <th
                          scope="row"
                          className="w-2/5 border-b border-slate-100 px-4 py-3 text-left align-top font-semibold text-ink-700 sm:w-1/3"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-brand-500">{fact.icon}</span>
                            {fact.label}
                          </span>
                        </th>
                        <td className="border-b border-slate-100 px-4 py-3 text-ink-900">
                          {fact.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>

            {job.images && job.images.length > 1 && (
              <div className="mt-6">
                <JobGallery images={job.images} title={job.title} />
              </div>
            )}

            <AdSlot placement="IN_CONTENT" className="mt-6" />

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

              {/* ---- Bottom CTA + share row — the closing "Apply" moment once the
                  candidate has read the full write-up, mirroring how job boards
                  end an article with a big apply button and share icons. ---- */}
              <div className="mt-10 rounded-xl bg-ink-50/70 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <ApplyJobButton
                    jobId={job.id}
                    jobSlug={job.slug}
                    applyUrl={job.applyUrl}
                    allowInternalApply={job.allowInternalApply}
                    alreadyApplied={alreadyApplied}
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Share</span>
                    <ShareButton url={jobUrl} title={`${job.title} at ${company.name}`} contentType="job" jobId={job.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="sticky top-24 space-y-6">
              {/* ---- Recent Jobs rail — sitewide, always populated, mirrors
                  the "Recent Posts" widget pattern used on jobcode.in ---- */}
              <RecentJobsWidget jobs={recentJobs.items} excludeJobId={job.id} />

              {/* ---- Stronger company card ---- */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 p-6">
                  {company.logoUrl ? (
                    <Image
                      src={company.logoUrl}
                      alt={company.name}
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
                      <h3 className="truncate font-serif text-lg font-bold text-ink-950">{company.name}</h3>
                      {company.isVerified && <BadgeCheck size={16} className="shrink-0 text-brand-500" />}
                    </div>
                    {companyProfile?.location && (
                      <p className="flex items-center gap-1 truncate text-xs text-ink-500">
                        <MapPin size={12} /> {companyProfile.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  {companyProfile?.description && (
                    <p className="line-clamp-4 text-sm leading-relaxed text-ink-600">{companyProfile.description}</p>
                  )}

                  <dl className="space-y-2.5 text-sm">
                    {companyProfile?._count && (
                      <div className="flex items-center justify-between">
                        <dt className="flex items-center gap-1.5 text-ink-500">
                          <Briefcase size={14} /> Open roles
                        </dt>
                        <dd className="font-semibold text-ink-900">{companyProfile._count.jobs}</dd>
                      </div>
                    )}
                    {companyProfile?.website && (
                      <div className="flex items-center justify-between gap-2">
                        <dt className="flex items-center gap-1.5 text-ink-500">
                          <Globe size={14} /> Website
                        </dt>
                        <dd className="truncate">
                          <a
                            href={companyProfile.website}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="font-semibold text-brand-600 hover:underline"
                          >
                            {companyProfile.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>

                  {company.slug && (
                    <Link
                      href={`/companies/${company.slug}`}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-ink-50 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-100"
                    >
                      View company profile →
                    </Link>
                  )}
                </div>
              </div>

              {otherCompanyJobs.length > 0 && (
                <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-600">
                    More at {company.name}
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
            <p className="truncate text-xs text-ink-500">{company.name}</p>
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

