import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'Create account',
  description: 'Create an account to apply for jobs, save listings, and join the conversation.',
  path: '/register',
});

export default function RegisterPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-ink-500">It only takes a minute</p>
      </div>
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}
