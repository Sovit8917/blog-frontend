import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { mySavedJobs } from '@/lib/api';
import { getCookieHeader } from '@/lib/auth/session';
import { UnsaveJobButton } from '@/components/jobs/UnsaveJobButton';
import { EMPLOYMENT_TYPE_LABEL, REMOTE_TYPE_LABEL } from '@/lib/jobs/format';
import { Badge } from '@/components/ui/Badge';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'Saved jobs',
  description: 'Jobs you have bookmarked to revisit later.',
  path: '/me/saved-jobs',
});

export default async function SavedJobsPage() {
  const saved = await mySavedJobs(getCookieHeader()).catch(() => []);

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900">Saved jobs</h1>
        <p className="mt-2 text-ink-500">Roles you&apos;ve bookmarked to come back to.</p>
      </header>

      {saved.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 py-16 text-center text-ink-400">
          You haven&apos;t saved any jobs yet.{' '}
          <Link href="/jobs" className="link-underline text-ink-700">
            Browse open roles
          </Link>
          .
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {saved.map((s) => (
            <li key={s.id} className="flex items-center gap-4 rounded-xl border border-ink-100 p-4">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-100">
                {s.job.company.logoUrl ? (
                  <Image src={s.job.company.logoUrl} alt={s.job.company.name} fill className="object-cover" />
                ) : (
                  <span className="text-sm font-bold text-ink-400">{s.job.company.name[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <Link href={`/jobs/${s.job.slug}`} className="font-semibold text-ink-900 hover:text-brand-600">
                  {s.job.title}
                </Link>
                <p className="text-sm text-ink-500">{s.job.company.name}</p>
                <div className="mt-1 flex gap-2">
                  <Badge variant="outline">{EMPLOYMENT_TYPE_LABEL[s.job.employmentType]}</Badge>
                  <Badge variant="outline">{REMOTE_TYPE_LABEL[s.job.remoteType]}</Badge>
                </div>
              </div>
              <UnsaveJobButton jobId={s.jobId} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
