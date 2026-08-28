'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, X } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { applyToJob } from '@/lib/api/jobs';
import { ApiRequestError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';

export function ApplyJobButton({
  jobId,
  jobSlug,
  applyUrl,
  allowInternalApply,
  alreadyApplied = false,
}: {
  jobId: string;
  jobSlug: string;
  applyUrl?: string | null;
  allowInternalApply: boolean;
  alreadyApplied?: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(alreadyApplied);

  // External-only applications just deep-link out — no internal application record.
  if (!allowInternalApply && applyUrl) {
    return (
      <Button href={applyUrl} className="w-full sm:w-auto">
        Apply on company site <ExternalLink size={15} />
      </Button>
    );
  }

  if (done) {
    return (
      <Button variant="outline" disabled className="w-full sm:w-auto">
        Applied ✓
      </Button>
    );
  }

  if (!user) {
    return (
      <Button href={`/login?redirect=/jobs/${jobSlug}`} className="w-full sm:w-auto">
        Sign in to apply
      </Button>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await applyToJob(jobId, { coverLetter: coverLetter || undefined, resumeUrl: resumeUrl || undefined });
      setDone(true);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not submit your application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        Apply now
      </Button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">Apply for this role</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1.5 text-ink-400 hover:bg-ink-50"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink-700">Resume URL (optional)</span>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://…"
                  className="rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink-700">Cover letter (optional)</span>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  placeholder="Tell them why you're a great fit…"
                  className="resize-none rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Submitting…' : 'Submit application'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
