'use client';

import { useState } from 'react';
import { FileText, Loader2, Trash2, Upload } from 'lucide-react';
import { deleteOwnResume, uploadResume } from '@/lib/api/users';
import { ApiRequestError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import type { ResumeInfo } from '@/types';

export function ResumePanel({ initialResume }: { initialResume: ResumeInfo | null }) {
  const [resume, setResume] = useState<ResumeInfo | null>(initialResume);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const updated = await uploadResume(file);
      setResume(updated);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not upload that file.');
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteOwnResume();
      setResume(null);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not remove your resume.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-ink-100 p-6">
      {resume?.resumeUrl ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-ink-200 bg-ink-50/60 p-4">
            <FileText size={22} className="shrink-0 text-ink-400" />
            <div className="min-w-0 flex-1">
              <a
                href={resume.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate font-medium text-ink-900 hover:text-brand-600"
              >
                {resume.resumeFileName || 'Your resume'}
              </a>
              {resume.resumeUpdatedAt && (
                <p className="text-xs text-ink-400">
                  Uploaded {new Date(resume.resumeUpdatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg ring-1 ring-inset ring-ink-300 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  <Upload size={15} /> Replace
                </>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                disabled={uploading || deleting}
                onChange={onFileChange}
              />
            </label>
            <Button variant="outline" onClick={onDelete} disabled={deleting || uploading}>
              <Trash2 size={15} /> {deleting ? 'Removing…' : 'Remove'}
            </Button>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 px-6 py-10 text-center text-ink-500 hover:border-brand-400 hover:text-brand-600">
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              <span className="text-sm font-medium">Uploading…</span>
            </>
          ) : (
            <>
              <Upload size={22} />
              <span className="text-sm font-medium">Upload your resume</span>
              <span className="text-xs text-ink-400">PDF, DOC, or DOCX — up to 8MB</span>
            </>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            disabled={uploading}
            onChange={onFileChange}
          />
        </label>
      )}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
