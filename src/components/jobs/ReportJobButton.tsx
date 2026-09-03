'use client';

import { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { reportJob, JOB_REPORT_REASON_LABEL, type JobReportReason } from '@/lib/api/jobs';
import { ApiRequestError } from '@/lib/api/client';

/** "Report this job" — lets any visitor flag spam/scam/stale listings for moderation. */
export function ReportJobButton({ jobSlug }: { jobSlug: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<JobReportReason>('SPAM');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await reportJob(jobSlug, { reason, note: note || undefined });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not submit your report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 dark:text-ink-500 transition hover:text-red-600 dark:hover:text-red-400"
      >
        <Flag size={12} /> Report this job
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-ink-900 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900 dark:text-ink-100">Report this job</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-md p-1.5 text-ink-400 dark:text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-800">
                <X size={18} />
              </button>
            </div>

            {done ? (
              <p className="text-sm text-ink-600 dark:text-ink-400">
                Thanks — we've received your report and our team will take a look.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-ink-700 dark:text-ink-300">Reason</span>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as JobReportReason)}
                    className="rounded-lg border border-ink-200 dark:border-ink-700 px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
                  >
                    {Object.entries(JOB_REPORT_REASON_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-ink-700 dark:text-ink-300">Additional details (optional)</span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="Anything else that would help us review this…"
                    className="resize-none rounded-lg border border-ink-200 dark:border-ink-700 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 dark:placeholder:text-ink-500 focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
                  />
                </label>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:opacity-50"
                >
                  {submitting ? 'Submitting…' : 'Submit report'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
