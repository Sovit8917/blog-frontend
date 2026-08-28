'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthProvider';
import { requestEmployerAccess } from '@/lib/api';
import { ApiRequestError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { EmployerRequest } from '@/types';

export function EmployerAccessPanel({ initialRequest }: { initialRequest: EmployerRequest | null }) {
  const { user } = useAuth();
  const [request, setRequest] = useState(initialRequest);
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user?.role === 'AUTHOR') {
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001';
    return (
      <div className="rounded-xl border border-ink-100 p-5 text-center">
        <Badge variant="brand">Approved</Badge>
        <p className="mt-3 text-sm text-ink-600">
          You already have employer access. Post and manage jobs from the admin console.
        </p>
        <Button href={`${adminUrl}/jobs`} className="mt-4 w-full">
          Go to job dashboard
        </Button>
      </div>
    );
  }

  if (user && user.role !== 'USER') {
    return (
      <div className="rounded-xl border border-ink-100 p-5 text-center text-sm text-ink-500">
        Staff accounts already have the access they need.
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const created = await requestEmployerAccess({ companyName, message: message || undefined });
      setRequest(created);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (request?.status === 'PENDING') {
    return (
      <div className="rounded-xl border border-ink-100 p-5 text-center">
        <Badge variant="outline">Pending review</Badge>
        <p className="mt-3 text-sm text-ink-600">
          Your request to post jobs for <span className="font-medium text-ink-900">{request.companyName}</span>{' '}
          is waiting on admin approval. We&apos;ll update this page once it&apos;s reviewed.
        </p>
      </div>
    );
  }

  return (
    <div>
      {request?.status === 'REJECTED' && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          Your previous request wasn&apos;t approved
          {request.reviewNote ? `: ${request.reviewNote}` : '.'} You can submit a new one below.
        </div>
      )}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-700">Company name</span>
          <input
            required
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-700">Message (optional)</span>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Anything the reviewer should know"
            className="rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Submitting…' : 'Request employer access'}
        </Button>

        {!user && (
          <p className="text-center text-sm text-ink-500">
            <Link href="/login?redirect=/me/employer-access" className="link-underline font-medium text-ink-900">
              Sign in
            </Link>{' '}
            first to request access.
          </p>
        )}
      </form>
    </div>
  );
}
