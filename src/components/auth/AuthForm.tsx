'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { EmailNotVerifiedError, useAuth } from '@/lib/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { GoogleButton } from '@/components/auth/GoogleButton';

type Field = { name: string; label: string; type: string; autoComplete?: string; minLength?: number };

const LOGIN_FIELDS: Field[] = [
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
];

const REGISTER_FIELDS: Field[] = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'username', label: 'Username', type: 'text', autoComplete: 'username' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', minLength: 8 },
];

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { user, login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fields = mode === 'login' ? LOGIN_FIELDS : REGISTER_FIELDS;
  const redirectTo = searchParams.get('redirect') || '/';

  // A signed-in visitor landing back on /login or /register (stale tab,
  // browser back button, a stray bookmark) should just continue on to
  // where they were headed rather than being shown a form for an account
  // they're already in.
  useEffect(() => {
    if (user) router.replace(redirectTo);
  }, [user, redirectTo, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ email: values.email ?? '', password: values.password ?? '' });
        router.push(redirectTo);
      } else {
        const { needsVerification } = await register({
          name: values.name ?? '',
          username: values.username ?? '',
          email: values.email ?? '',
          password: values.password ?? '',
        });
        if (needsVerification) {
          router.push(`/verify-email?email=${encodeURIComponent(values.email ?? '')}`);
        } else {
          router.push(redirectTo);
        }
      }
    } catch (err) {
      if (err instanceof EmailNotVerifiedError) {
        router.push(`/verify-email?email=${encodeURIComponent(err.email)}`);
        return;
      }
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user) return null;

  return (
    <div className="w-full max-w-sm">
      <GoogleButton redirectTo={redirectTo} />

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">or</span>
        <div className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          {fields.map((field) => (
            <label key={field.name} className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink-700 dark:text-ink-300">{field.label}</span>
              {field.type === 'password' ? (
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={field.autoComplete}
                    minLength={field.minLength}
                    value={values[field.name] ?? ''}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                    className="w-full rounded-lg border border-ink-200 dark:border-ink-700 px-3.5 py-2.5 pr-10 text-sm outline-none placeholder:text-ink-400 dark:placeholder:text-ink-500 focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-400 dark:text-ink-500 transition hover:text-ink-600 dark:hover:text-ink-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              ) : (
                <input
                  required
                  type={field.type}
                  autoComplete={field.autoComplete}
                  value={values[field.name] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  className="rounded-lg border border-ink-200 dark:border-ink-700 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 dark:placeholder:text-ink-500 focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
                />
              )}
              {field.name === 'password' && mode === 'register' && (
                <span className="text-xs text-ink-400 dark:text-ink-500">At least 8 characters.</span>
              )}
            </label>
          ))}
        </div>

        {mode === 'login' && (
          <div className="mt-2 text-right">
            <Link href="/forgot-password" className="link-underline text-sm font-medium text-ink-500 dark:text-ink-400">
              Forgot password?
            </Link>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <Button type="submit" disabled={submitting} className="mt-6 w-full">
          {submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-500 dark:text-ink-400">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="link-underline font-medium text-ink-900 dark:text-ink-100">
              Create one
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" className="link-underline font-medium text-ink-900 dark:text-ink-100">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
