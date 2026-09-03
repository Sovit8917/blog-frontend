import type { Metadata } from 'next';
import { myJobAlerts } from '@/lib/api/jobs';
import { getCookieHeader } from '@/lib/auth/session';
import { buildListMetadata } from '@/lib/seo/metadata';
import { JobAlertsPanel } from '@/components/jobs/JobAlertsPanel';

export const metadata: Metadata = buildListMetadata({
  title: 'Job alerts',
  description: 'Saved job searches that email you when new matches are published.',
  path: '/me/job-alerts',
});

export default async function JobAlertsPage() {
  const alerts = await myJobAlerts(getCookieHeader()).catch(() => []);

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900 dark:text-ink-100">Job alerts</h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          Saved searches from the <a className="link-underline text-ink-700 dark:text-ink-300" href="/jobs">jobs page</a> — we
          email you a digest whenever a new listing matches.
        </p>
      </header>

      <JobAlertsPanel initialAlerts={alerts} />
    </div>
  );
}
