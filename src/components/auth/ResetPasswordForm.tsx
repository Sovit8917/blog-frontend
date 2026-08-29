'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/Button';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-sm text-red-600">
          This reset link is missing or invalid. Request a new one below.
        </p>
        <Link href="/forgot-password" className="link-underline mt-5 inline-block text-sm font-medium text-ink-900">
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-sm text-ink-600">Your password has been reset.</p>
        <Button href="/login" className="mt-5 w-full">
          Sign in
        </Button>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: reqError } = await authClient.resetPassword({ newPassword: password, token });
      if (reqError) throw new Error(reqError.message || 'This link may have expired');
      setDone(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-700">New password</span>
        <input
          required
          minLength={8}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </label>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={submitting} className="mt-6 w-full">
        {submitting ? 'Saving…' : 'Reset password'}
      </Button>
    </form>
  );
}
