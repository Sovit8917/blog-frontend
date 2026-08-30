import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyEmailNotice } from '@/components/auth/VerifyEmailNotice';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'Verify your email',
  description: 'Confirm your email address to finish creating your account.',
  path: '/verify-email',
});

export default function VerifyEmailPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Please verify your email</h1>
        <p className="mt-1.5 text-sm text-ink-500">One more step before you&apos;re in</p>
      </div>
      <Suspense>
        <VerifyEmailNotice />
      </Suspense>
    </div>
  );
}
