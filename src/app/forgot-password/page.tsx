import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'Forgot password',
  description: 'Reset the password for your account.',
  path: '/forgot-password',
});

export default function ForgotPasswordPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Reset your password</h1>
        <p className="mt-1.5 text-sm text-ink-500">We&apos;ll email you a link to get back in</p>
      </div>
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
