import type { Metadata } from 'next';
import { getOwnEmployerRequest } from '@/lib/api';
import { getCookieHeader } from '@/lib/auth/session';
import { buildListMetadata } from '@/lib/seo/metadata';
import { EmployerAccessPanel } from '@/components/auth/EmployerAccessPanel';

export const metadata: Metadata = buildListMetadata({
  title: 'Employer access',
  description: 'Request permission to post jobs on behalf of your company.',
  path: '/me/employer-access',
});

export default async function EmployerAccessPage() {
  const request = await getOwnEmployerRequest(getCookieHeader()).catch(() => null);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center py-16">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Employer access</h1>
          <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">
            Request permission to post jobs. An admin reviews every request.
          </p>
        </header>
        <EmployerAccessPanel initialRequest={request} />
      </div>
    </div>
  );
}
