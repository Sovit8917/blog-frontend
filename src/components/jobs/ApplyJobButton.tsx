'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, FileText, Loader2, Upload, X } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { applyToJob } from '@/lib/api/jobs';
import { getOwnResume, uploadResume } from '@/lib/api/users';
import { ApiRequestError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import type { ResumeInfo } from '@/types';

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
  const [resume, setResume] = useState<ResumeInfo | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(alreadyApplied);

  // Without this, the page behind the modal keeps scrolling on mobile —
  // easy to miss on desktop since the modal fills less of the viewport there.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Pull in the applicant's saved resume (#17) as soon as the modal opens,
  // so "apply with your resume on file" is the default path rather than
  // asking every applicant to paste a URL every time.
  useEffect(() => {
    if (!open || !user) return;
    setResumeLoading(true);
    getOwnResume()
      .then(setResume)
      .catch(() => setResume(null))
      .finally(() => setResumeLoading(false));
  }, [open, user]);

  const onResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    setResumeUploading(true);
    setResumeError(null);
    try {
      const updated = await uploadResume(file);
      setResume(updated);
    } catch (err) {
      setResumeError(err instanceof ApiRequestError ? err.message : 'Could not upload that file.');
    } finally {
      setResumeUploading(false);
    }
  };

  // External-only applications just deep-link out — no internal application record.
  if (!allowInternalApply && applyUrl) {
    return (
      <Button
        href={applyUrl}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        className="w-full sm:w-auto"
      >
        Apply Now <ExternalLink size={15} />
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
      await applyToJob(jobId, {
        coverLetter: coverLetter || undefined,
        // Explicit even though the backend falls back to the saved resume on
        // its own — keeps this request self-describing about what's being sent.
        resumeUrl: resume?.resumeUrl || undefined,
      });
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
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
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
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink-700">Resume</span>
                {resumeLoading ? (
                  <div className="flex items-center gap-2 rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm text-ink-400">
                    <Loader2 size={15} className="animate-spin" /> Checking your profile…
                  </div>
                ) : resume?.resumeUrl ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-ink-200 bg-ink-50/60 px-3.5 py-2.5 text-sm">
                    <span className="flex min-w-0 items-center gap-2 text-ink-700">
                      <FileText size={15} className="shrink-0 text-ink-400" />
                      <span className="truncate">{resume.resumeFileName || 'Saved resume'}</span>
                    </span>
                    <label className="shrink-0 cursor-pointer font-medium text-brand-600 hover:text-brand-700">
                      {resumeUploading ? 'Uploading…' : 'Replace'}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        disabled={resumeUploading}
                        onChange={onResumeFileChange}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-ink-300 px-3.5 py-3 text-sm text-ink-500 hover:border-brand-400 hover:text-brand-600">
                    {resumeUploading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Uploading…
                      </>
                    ) : (
                      <>
                        <Upload size={15} /> Upload resume (PDF or Word)
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      disabled={resumeUploading}
                      onChange={onResumeFileChange}
                    />
                  </label>
                )}
                {resumeError && <p className="text-sm text-red-600">{resumeError}</p>}
                {!resumeLoading && (
                  <span className="text-xs text-ink-400">
                    Optional — you can still submit without one. Saved to your profile for next time.
                  </span>
                )}
              </div>
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
              <Button type="submit" disabled={submitting || resumeUploading} className="w-full">
                {submitting ? 'Submitting…' : 'Submit application'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
