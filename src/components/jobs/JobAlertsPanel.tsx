'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Search, Trash2 } from 'lucide-react';
import { deleteJobAlert, previewJobAlert, updateJobAlert } from '@/lib/api/jobs';
import { getJobCompany } from '@/lib/jobs/format';
import { ApiRequestError } from '@/lib/api/client';
import { Badge } from '@/components/ui/Badge';
import {
  EMPLOYMENT_TYPE_LABEL,
  EXPERIENCE_LEVEL_LABEL,
  REMOTE_TYPE_LABEL,
} from '@/lib/jobs/format';
import type { AlertFrequency, JobAlert, JobCard } from '@/types';

const FREQUENCY_LABEL: Record<AlertFrequency, string> = {
  INSTANT: 'As soon as posted',
  DAILY: 'Daily digest',
  WEEKLY: 'Weekly digest',
};

export function JobAlertsPanel({ initialAlerts }: { initialAlerts: JobAlert[] }) {
  const [alerts, setAlerts] = useState(initialAlerts);

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink-200 dark:border-ink-700 py-16 text-center text-ink-400 dark:text-ink-500">
        No saved alerts yet.{' '}
        <Link href="/jobs" className="link-underline text-ink-700 dark:text-ink-300">
          Search jobs
        </Link>{' '}
        and use &quot;Get alerts for this search&quot; to create one.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {alerts.map((alert) => (
        <AlertRow
          key={alert.id}
          alert={alert}
          onChange={(next) => setAlerts((prev) => prev.map((a) => (a.id === next.id ? next : a)))}
          onDelete={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
        />
      ))}
    </ul>
  );
}

function AlertRow({
  alert,
  onChange,
  onDelete,
}: {
  alert: JobAlert;
  onChange: (next: JobAlert) => void;
  onDelete: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<JobCard[] | null>(null);
  const [previewing, setPreviewing] = useState(false);

  const toggleActive = async () => {
    setBusy(true);
    setError(null);
    try {
      onChange(await updateJobAlert(alert.id, { isActive: !alert.isActive }));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not update this alert.');
    } finally {
      setBusy(false);
    }
  };

  const changeFrequency = async (frequency: AlertFrequency) => {
    setBusy(true);
    setError(null);
    try {
      onChange(await updateJobAlert(alert.id, { frequency }));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not update this alert.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await deleteJobAlert(alert.id);
      onDelete();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not delete this alert.');
      setBusy(false);
    }
  };

  const runPreview = async () => {
    setPreviewing(true);
    try {
      setPreview(await previewJobAlert(alert.id));
    } catch {
      setPreview([]);
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <li className="rounded-xl border border-ink-100 dark:border-ink-800 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink-900 dark:text-ink-100">{alert.name}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {alert.keywords && <Badge variant="outline">&quot;{alert.keywords}&quot;</Badge>}
            {alert.location && <Badge variant="outline">{alert.location}</Badge>}
            {alert.remoteType && <Badge variant="outline">{REMOTE_TYPE_LABEL[alert.remoteType]}</Badge>}
            {alert.employmentType && (
              <Badge variant="outline">{EMPLOYMENT_TYPE_LABEL[alert.employmentType]}</Badge>
            )}
            {alert.experienceLevel && (
              <Badge variant="outline">{EXPERIENCE_LEVEL_LABEL[alert.experienceLevel]}</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={alert.frequency}
            onChange={(e) => changeFrequency(e.target.value as AlertFrequency)}
            disabled={busy}
            className="rounded-lg border border-ink-200 dark:border-ink-700 px-2.5 py-1.5 text-xs font-medium text-ink-700 dark:text-ink-300 outline-none focus:border-brand-400 dark:focus:border-brand-600"
          >
            {Object.entries(FREQUENCY_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            onClick={toggleActive}
            disabled={busy}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              alert.isActive ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400'
            }`}
          >
            {alert.isActive ? 'Active' : 'Paused'}
          </button>

          <button
            onClick={remove}
            disabled={busy}
            aria-label="Delete alert"
            className="rounded-lg p-2 text-ink-400 dark:text-ink-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-3 border-t border-ink-100 dark:border-ink-800 pt-3">
        {preview === null ? (
          <button
            onClick={runPreview}
            disabled={previewing}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-400"
          >
            {previewing ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            See what currently matches
          </button>
        ) : preview.length === 0 ? (
          <p className="text-sm text-ink-400 dark:text-ink-500">Nothing matches this alert right now.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {preview.map((job) => (
              <li key={job.id}>
                <Link href={`/jobs/${job.slug}`} className="text-sm font-medium text-ink-700 dark:text-ink-300 hover:text-brand-600 dark:hover:text-brand-400">
                  {job.title}
                </Link>{' '}
                <span className="text-sm text-ink-400 dark:text-ink-500">— {getJobCompany(job).name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
