'use client';

import { useState } from 'react';
import { BellPlus, X } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { createJobAlert } from '@/lib/api/jobs';
import { ApiRequestError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import type { ListJobsParams } from '@/types';

/**
 * "Save this search" (#19) — turns the /jobs page's current filter state
 * directly into a JobAlert. Field names mirror ListJobsParams except
 * `search` -> `keywords`, which is the one place the two shapes diverge.
 */
export function SaveSearchAlertButton({ params }: { params: ListJobsParams }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const hasFilters = Boolean(
    params.search || params.location || params.remoteType || params.employmentType || params.experienceLevel,
  );
  if (!hasFilters) return null;

  if (!user) {
    return (
      <Button variant="outline" size="sm" href={`/login?redirect=/jobs`}>
        <BellPlus size={15} /> Get alerts for this search
      </Button>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createJobAlert({
        name: name || 'Saved search',
        keywords: params.search,
        location: params.location,
        remoteType: params.remoteType,
        employmentType: params.employmentType,
        experienceLevel: params.experienceLevel,
        skillSlugs: params.skill ? [params.skill] : undefined,
      });
      setDone(true);
      setTimeout(() => setOpen(false), 1200);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not save this alert.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <BellPlus size={15} /> Get alerts for this search
      </Button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">Save this search as an alert</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1.5 text-ink-400 hover:bg-ink-50"
              >
                <X size={18} />
              </button>
            </div>
            {done ? (
              <p className="text-sm text-emerald-600">
                Saved! We&apos;ll email you when new matching jobs go live.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-ink-700">Alert name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Remote React roles"
                    className="rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </label>
                <p className="text-xs text-ink-400">
                  Uses your current filters. Manage or delete alerts anytime under{' '}
                  <span className="font-medium">My resume &amp; alerts</span>.
                </p>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Saving…' : 'Save alert'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
