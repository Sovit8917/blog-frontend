'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/lib/api';

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await subscribeNewsletter(email, compact ? 'footer' : 'newsletter-widget');
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">You&apos;re subscribed — check your inbox to confirm.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2.5 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full min-w-0 rounded-xl border border-slate-200 dark:border-ink-700 bg-white dark:bg-ink-950/80 px-4 py-2.5 text-sm text-slate-900 dark:text-ink-100 placeholder:text-slate-400 dark:placeholder:text-ink-500 shadow-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-950 dark:bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 dark:hover:bg-brand-500 active:scale-95 disabled:opacity-60"
      >
        {status === 'loading' ? 'Joining…' : 'Subscribe'}
      </button>
    </form>
  );
}
