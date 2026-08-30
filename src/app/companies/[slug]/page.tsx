import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, MapPin, BadgeCheck } from 'lucide-react';
import { getCompanyBySlug } from '@/lib/api';
import type { EmploymentType, RemoteType } from '@/types';
import { formatSalaryRange, EMPLOYMENT_TYPE_LABEL, REMOTE_TYPE_LABEL } from '@/lib/jobs/format';
import { timeAgo } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { buildListMetadata, SITE } from '@/lib/seo/metadata';
import { ShareButton } from '@/components/shared/ShareButton';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const company = await getCompanyBySlug(params.slug).catch(() => null);
  if (!company) return {};
  return buildListMetadata({
    title: company.seoTitle || company.name,
    description: company.seoDescription || company.description || `Open roles at ${company.name}`,
    path: `/companies/${company.slug}`,
    image: company.ogImageUrl,
  });
}

export const revalidate = 120;

export default async function CompanyDetailPage({ params }: Props) {
  const company = await getCompanyBySlug(params.slug).catch(() => null);
  if (!company) notFound();

  const jobs = (company.jobs ?? []) as Array<{
    id: string;
    slug: string;
    title: string;
    employmentType: EmploymentType;
    remoteType: RemoteType;
    salaryMin?: number | null;
    salaryMax?: number | null;
    salaryCurrency: string;
    publishedAt?: string | null;
  }>;

  return (
    <div className="bg-slate-50/50 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <header className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-10 shadow-sm flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
              {company.logoUrl ? (
                <Image src={company.logoUrl} alt={company.name} fill className="object-cover" />
              ) : (
                <span className="text-3xl font-serif font-bold text-brand-600">{company.name[0]}</span>
              )}
            </div>
            <div>
              <h1 className="flex items-center gap-2 font-serif text-3xl font-extrabold text-ink-950">
                {company.name}
                {company.isVerified && <BadgeCheck size={22} className="text-brand-500" />}
              </h1>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-500">
                {company.location && (
                  <span className="flex items-center gap-1.5"><MapPin size={15} /> {company.location}</span>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 link-underline text-brand-600 font-medium"
                  >
                    <Globe size={15} /> Website
                  </a>
                )}
              </div>
              {company.description && <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600">{company.description}</p>}
            </div>
          </div>
          <ShareButton url={`${SITE.url}/companies/${company.slug}`} title={company.name} contentType="company" className="shrink-0" />
        </header>

        <section className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-ink-900">
            Open roles {jobs.length > 0 && <span className="text-ink-400">({jobs.length})</span>}
          </h2>
          {jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-ink-400">
              No open roles right now.{' '}
              <Link href="/jobs" className="link-underline text-brand-600 font-semibold">
                Browse all jobs
              </Link>
              .
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {jobs.map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="group flex flex-col gap-2 rounded-xl border border-slate-200/80 p-5 transition hover:border-brand-300 hover:bg-slate-50/50 hover:shadow-sm"
                  >
                    <h3 className="text-lg font-bold text-ink-900 transition group-hover:text-brand-600">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{EMPLOYMENT_TYPE_LABEL[job.employmentType]}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{REMOTE_TYPE_LABEL[job.remoteType]}</span>
                      {formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency) && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                          {formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                        </span>
                      )}
                      {job.publishedAt && <Badge variant="outline">Posted {timeAgo(job.publishedAt)}</Badge>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
