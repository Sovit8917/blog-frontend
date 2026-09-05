'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function VerifyEmailNotice() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  return (
    <div className="w-full max-w-sm text-center">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
        <MailCheck size={22} />
      </div>

      <p className="text-sm text-ink-600 dark:text-ink-400">
        {email ? (
          <>
            The account for <span className="font-medium text-ink-900 dark:text-ink-100">{email}</span> hasn&apos;t
            been verified yet.
          </>
        ) : (
          <>This account hasn&apos;t been verified yet.</>
        )}{' '}
        New sign-ups now verify by email code before the account is created — try creating it again to get a fresh
        code.
      </p>

      <Link href="/register" className="mt-6 block">
        <Button type="button" className="w-full">
          Go to sign up
        </Button>
      </Link>

      <p className="mt-5 text-center text-sm text-ink-500 dark:text-ink-400">
        Already verified?{' '}
        <Link href="/login" className="link-underline font-medium text-ink-900 dark:text-ink-100">
          Sign in
        </Link>
      </p>
    </div>
  );
}
