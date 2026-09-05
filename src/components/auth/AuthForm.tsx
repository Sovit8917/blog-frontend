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

// Step 2 of registration — the rest of the account, collected only after
// the email has already been OTP-verified in step 1.
const DETAILS_FIELDS: Field[] = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'username', label: 'Username', type: 'text', autoComplete: 'username' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', minLength: 8 },
];

const RESEND_COOLDOWN_SECONDS = 30;

function TextField({
  field,
  value,
  onChange,
  showPassword,
  onToggleShowPassword,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-700 dark:text-ink-300">{field.label}</span>
      {field.type === 'password' ? (
        <div className="relative">
          <input
            required
            type={showPassword ? 'text' : 'password'}
            autoComplete={field.autoComplete}
            minLength={field.minLength}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-ink-200 dark:border-ink-700 px-3.5 py-2.5 pr-10 text-sm outline-none placeholder:text-ink-400 dark:placeholder:text-ink-500 focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
          />
          <button
            type="button"
            onClick={onToggleShowPassword}
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-ink-200 dark:border-ink-700 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 dark:placeholder:text-ink-500 focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
        />
      )}
      {field.name === 'password' && (
        <span className="text-xs text-ink-400 dark:text-ink-500">At least 8 characters.</span>
      )}
    </label>
  );
}

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { user, login, sendSignupOtp, verifySignupOtp, finishSignup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Registration is a 3-step flow: email -> OTP code -> the rest of the
  // form. Login stays a single step.
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
  const [cooldown, setCooldown] = useState(0);

  const redirectTo = searchParams.get('redirect') || '/';

  // Redirect away only if the visitor was ALREADY signed in when this
  // page loaded (e.g. they browsed to /login or /register directly).
  // Deliberately NOT reacting to `user` on every change — login() and
  // finishSignup() call router.refresh() right after setUser, which
  // would otherwise make this fire and race their own explicit
  // router.push()/router.replace() calls below.
  useEffect(() => {
    if (user) router.replace(redirectTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const set = (name: string, v: string) => setValues((prev) => ({ ...prev, [name]: v }));

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email: values.email ?? '', password: values.password ?? '' });
      router.push(redirectTo);
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

  const onSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await sendSignupOtp(values.email ?? '');
      setStep('otp');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send a verification code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onResendOtp = async () => {
    if (cooldown > 0) return;
    setError(null);
    setSubmitting(true);
    try {
      await sendSignupOtp(values.email ?? '');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend the code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await verifySignupOtp(values.email ?? '', values.otp ?? '');
      setStep('details');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Incorrect code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { onboardingRequired } = await finishSignup({
        email: values.email ?? '',
        otp: values.otp ?? '',
        name: values.name ?? '',
        username: values.username ?? '',
        password: values.password ?? '',
      });
      router.push(onboardingRequired ? '/onboarding' : redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user) return null;

  if (mode === 'login') {
    return (
      <div className="w-full max-w-sm">
        <GoogleButton redirectTo={redirectTo} />

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
          <span className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">or</span>
          <div className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
        </div>

        <form onSubmit={onSubmitLogin}>
          <div className="flex flex-col gap-4">
            {LOGIN_FIELDS.map((field) => (
              <TextField
                key={field.name}
                field={field}
                value={values[field.name] ?? ''}
                onChange={(v) => set(field.name, v)}
                showPassword={showPassword}
                onToggleShowPassword={() => setShowPassword((s) => !s)}
              />
            ))}
          </div>

          <div className="mt-2 text-right">
            <Link href="/forgot-password" className="link-underline text-sm font-medium text-ink-500 dark:text-ink-400">
              Forgot password?
            </Link>
          </div>

          {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

          <Button type="submit" disabled={submitting} className="mt-6 w-full">
            {submitting ? 'Please wait…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-500 dark:text-ink-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="link-underline font-medium text-ink-900 dark:text-ink-100">
            Create one
          </Link>
        </p>
      </div>
    );
  }

  // ---- Registration: email -> OTP -> details ----
  return (
    <div className="w-full max-w-sm">
      {step === 'email' && (
        <>
          <GoogleButton redirectTo={redirectTo} />
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
            <span className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">or</span>
            <div className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
          </div>

          <form onSubmit={onSubmitEmail}>
            <TextField
              field={{ name: 'email', label: 'Email', type: 'email', autoComplete: 'email' }}
              value={values.email ?? ''}
              onChange={(v) => set('email', v)}
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword((s) => !s)}
            />

            {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

            <Button type="submit" disabled={submitting} className="mt-6 w-full">
              {submitting ? 'Sending code…' : 'Send verification code'}
            </Button>
          </form>
        </>
      )}

      {step === 'otp' && (
        <form onSubmit={onSubmitOtp}>
          <p className="mb-4 text-sm text-ink-600 dark:text-ink-400">
            We sent a 6-digit code to <span className="font-medium text-ink-900 dark:text-ink-100">{values.email}</span>.
            Enter it below to continue.
          </p>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink-700 dark:text-ink-300">Verification code</span>
            <input
              required
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              autoComplete="one-time-code"
              value={values.otp ?? ''}
              onChange={(e) => set('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="rounded-lg border border-ink-200 dark:border-ink-700 px-3.5 py-2.5 text-center text-lg tracking-[0.5em] outline-none placeholder:text-ink-400 dark:placeholder:text-ink-500 focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
              placeholder="••••••"
            />
          </label>

          {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

          <Button type="submit" disabled={submitting || (values.otp ?? '').length !== 6} className="mt-6 w-full">
            {submitting ? 'Verifying…' : 'Verify code'}
          </Button>

          <button
            type="button"
            onClick={onResendOtp}
            disabled={submitting || cooldown > 0}
            className="mt-3 w-full text-center text-sm font-medium text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300 disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('email');
              setError(null);
              set('otp', '');
            }}
            className="mt-1 w-full text-center text-xs text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-400"
          >
            Wrong email? Start over
          </button>
        </form>
      )}

      {step === 'details' && (
        <form onSubmit={onSubmitDetails}>
          <p className="mb-4 text-sm text-ink-600 dark:text-ink-400">
            Email verified — just a few more details to finish creating your account.
          </p>
          <div className="flex flex-col gap-4">
            {DETAILS_FIELDS.map((field) => (
              <TextField
                key={field.name}
                field={field}
                value={values[field.name] ?? ''}
                onChange={(v) => set(field.name, v)}
                showPassword={showPassword}
                onToggleShowPassword={() => setShowPassword((s) => !s)}
              />
            ))}
          </div>

          {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

          <Button type="submit" disabled={submitting} className="mt-6 w-full">
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-ink-500 dark:text-ink-400">
        Already have an account?{' '}
        <Link href="/login" className="link-underline font-medium text-ink-900 dark:text-ink-100">
          Sign in
        </Link>
      </p>
    </div>
  );
}