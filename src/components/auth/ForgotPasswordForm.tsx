'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/Button';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: reqError } = await authClient.forgetPassword({
        email,
        redirectTo: '/reset-password',
      });
      if (reqError) throw new Error(reqError.message || 'Something went wrong');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-sm text-ink-600">
          If an account exists for <span className="font-medium text-ink-900">{email}</span>, we&apos;ve sent a
          link to reset your password.
        </p>
        <Link href="/login" className="link-underline mt-5 inline-block text-sm font-medium text-ink-900">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-700">Email</span>
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </label>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={submitting} className="mt-6 w-full">
        {submitting ? 'Sending…' : 'Send reset link'}
      </Button>

      <p className="mt-5 text-center text-sm text-ink-500">
        <Link href="/login" className="link-underline font-medium text-ink-900">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
