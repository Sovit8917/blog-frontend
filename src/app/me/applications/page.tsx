import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { myApplications } from '@/lib/api';
import { getCookieHeader } from '@/lib/auth/session';
import { APPLICATION_STATUS_LABEL } from '@/lib/api/jobs';
import { Badge } from '@/components/ui/Badge';
import { WithdrawApplicationButton } from '@/components/jobs/WithdrawApplicationButton';
import { timeAgo } from '@/lib/utils';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'My applications',
  description: 'Track the jobs you have applied to.',
  path: '/me/applications',
});

const STATUS_VARIANT: Record<string, 'default' | 'brand' | 'outline'> = {
  SUBMITTED: 'outline',
  REVIEWED: 'default',
  SHORTLISTED: 'brand',
  REJECTED: 'default',
  HIRED: 'brand',
  WITHDRAWN: 'default',
};

export default async function MyApplicationsPage() {
  const applications = await myApplications(getCookieHeader()).catch(() => []);

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900">My applications</h1>
        <p className="mt-2 text-ink-500">Jobs you&apos;ve applied to and their current status.</p>
      </header>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 py-16 text-center text-ink-400">
          You haven&apos;t applied to any jobs yet.{' '}
          <Link href="/jobs" className="link-underline text-ink-700">
            Browse open roles
          </Link>
          .
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {applications.map((app) => (
            <li key={app.id} className="flex items-center gap-4 rounded-xl border border-ink-100 p-4">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-100">
                {app.job?.company.logoUrl ? (
                  <Image src={app.job.company.logoUrl} alt={app.job.company.name} fill className="object-cover" />
                ) : (
                  <span className="text-sm font-bold text-ink-400">{app.job?.company.name?.[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <Link href={`/jobs/${app.job?.slug}`} className="font-semibold text-ink-900 hover:text-brand-600">
                  {app.job?.title}
                </Link>
                <p className="text-sm text-ink-500">{app.job?.company.name}</p>
                <p className="mt-0.5 text-xs text-ink-400">Applied {timeAgo(app.createdAt)}</p>
              </div>
              <Badge variant={STATUS_VARIANT[app.status] ?? 'default'}>
                {APPLICATION_STATUS_LABEL[app.status]}
              </Badge>
              {app.status !== 'WITHDRAWN' && <WithdrawApplicationButton applicationId={app.id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
