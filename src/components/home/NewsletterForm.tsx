'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/lib/api';
import { Button } from '@/components/ui/Button';

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
    return <p className="text-sm font-medium text-brand-600">You&apos;re subscribed — check your inbox to confirm.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full min-w-0 rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
      <Button type="submit" size={compact ? 'sm' : 'md'} disabled={status === 'loading'}>
        {status === 'loading' ? 'Joining…' : 'Subscribe'}
      </Button>
    </form>
  );
}
