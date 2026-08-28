'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthProvider';
import { ApiRequestError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';

type Field = { name: string; label: string; type: string; autoComplete?: string };

const LOGIN_FIELDS: Field[] = [
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
];

const REGISTER_FIELDS: Field[] = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'username', label: 'Username', type: 'text', autoComplete: 'username' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
];

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fields = mode === 'login' ? LOGIN_FIELDS : REGISTER_FIELDS;
  const redirectTo = searchParams.get('redirect') || '/';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ email: values.email ?? '', password: values.password ?? '' });
      } else {
        await register({
          name: values.name ?? '',
          username: values.username ?? '',
          email: values.email ?? '',
          password: values.password ?? '',
        });
      }
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <label key={field.name} className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink-700">{field.label}</span>
            <input
              required
              type={field.type}
              autoComplete={field.autoComplete}
              value={values[field.name] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
              className="rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={submitting} className="mt-6 w-full">
        {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
      </Button>

      <p className="mt-5 text-center text-sm text-ink-500">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="link-underline font-medium text-ink-900">
              Create one
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" className="link-underline font-medium text-ink-900">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
