import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'Reset password',
  description: 'Choose a new password for your account.',
  path: '/reset-password',
});

export default function ResetPasswordPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Choose a new password</h1>
      </div>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
