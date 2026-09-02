import type { Metadata } from 'next';
import { getOwnPreferences } from '@/lib/api/users';
import { getCookieHeader } from '@/lib/auth/session';
import { buildListMetadata } from '@/lib/seo/metadata';
import { PreferencesPanel } from '@/components/jobs/PreferencesPanel';

export const metadata: Metadata = buildListMetadata({
  title: 'Job preferences',
  description: 'Tell us what you\u2019re looking for so we can match you with relevant roles.',
  path: '/me/preferences',
});

export default async function PreferencesPage() {
  const preferences = await getOwnPreferences(getCookieHeader()).catch(() => null);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center py-16">
      <div className="w-full max-w-lg">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-ink-900">Job preferences</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Set your location, work style, and skills — we use these to power your{' '}
            <span className="font-medium text-ink-700">Jobs for you</span> matches.
          </p>
        </header>
        <PreferencesPanel initial={preferences} />
      </div>
    </div>
  );
}
