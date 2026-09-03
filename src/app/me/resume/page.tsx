import type { Metadata } from 'next';
import { getOwnResume } from '@/lib/api/users';
import { getCookieHeader } from '@/lib/auth/session';
import { buildListMetadata } from '@/lib/seo/metadata';
import { ResumePanel } from '@/components/jobs/ResumePanel';

export const metadata: Metadata = buildListMetadata({
  title: 'My resume',
  description: 'Upload a resume to reuse on every job application.',
  path: '/me/resume',
});

export default async function ResumePage() {
  const resume = await getOwnResume(getCookieHeader()).catch(() => null);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center py-16">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">My resume</h1>
          <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
            Uploaded once here, used automatically on every job application (#17) unless you swap in a
            different one for a specific role.
          </p>
        </header>
        <ResumePanel initialResume={resume} />
      </div>
    </div>
  );
}
