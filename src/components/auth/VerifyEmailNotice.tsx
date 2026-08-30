'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '@/components/ui/Button';

const RESEND_COOLDOWN_SECONDS = 30;

export function VerifyEmailNotice() {
  const { resendVerificationEmail } = useAuth();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const onResend = async () => {
    if (!email || cooldown > 0) return;
    setError(null);
    setSending(true);
    try {
      await resendVerificationEmail(email);
      setJustSent(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-sm text-center">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <MailCheck size={22} />
      </div>

      <p className="text-sm text-ink-600">
        {email ? (
          <>
            We&apos;ve sent a verification link to <span className="font-medium text-ink-900">{email}</span>.
          </>
        ) : (
          <>We&apos;ve sent you a verification link.</>
        )}{' '}
        Click it to activate your account and sign in automatically.
      </p>

      <p className="mt-3 text-xs text-ink-400">Didn&apos;t get it? Check your spam folder, or resend below.</p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {justSent && !error && <p className="mt-4 text-sm text-green-600">Verification email sent.</p>}

      <Button
        type="button"
        onClick={onResend}
        disabled={!email || sending || cooldown > 0}
        className="mt-6 w-full"
      >
        {sending ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
      </Button>

      <p className="mt-5 text-center text-sm text-ink-500">
        Wrong email?{' '}
        <Link href="/register" className="link-underline font-medium text-ink-900">
          Create a new account
        </Link>{' '}
        or{' '}
        <Link href="/login" className="link-underline font-medium text-ink-900">
          sign in
        </Link>
      </p>
    </div>
  );
}
