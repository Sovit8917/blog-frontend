'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle2, AlertCircle, Upload, FileText, MapPin, Building2 } from 'lucide-react';
import { analyzeResumeFile, getLatestResumeAnalysis, getResumeRecommendedJobs } from '@/lib/api/resume-ats';
import { ApiRequestError } from '@/lib/api/client';
import type { ResumeAnalysisResult, ResumeRecommendedJob } from '@/types';

function ScoreBar({ score }: { score?: number }) {
  const safeScore = typeof score === 'number' && !isNaN(score) ? Math.min(100, Math.max(0, score)) : 0;
  const color = safeScore >= 70 ? 'bg-emerald-500' : safeScore >= 40 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div className={`h-full ${color} transition-all`} style={{ width: `${safeScore}%` }} />
    </div>
  );
}

function MiniBar({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (score / max) * 100)) : 0;
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-400';
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function MatchBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
      : score >= 40
      ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
  return (
    <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
      <CheckCircle2 size={12} /> {score}% match
    </span>
  );
}

export function ResumeAtsAnalyzer() {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [recommended, setRecommended] = useState<ResumeRecommendedJob[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getLatestResumeAnalysis()
      .then((result) => setAnalysis(result))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!analysis) return;
    setLoadingJobs(true);
    getResumeRecommendedJobs(10)
      .then(setRecommended)
      .catch(() => setRecommended([]))
      .finally(() => setLoadingJobs(false));
  }, [analysis]);

  const analyzeFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const result = await analyzeResumeFile(file);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not read or analyze that file.');
    } finally {
      setUploading(false);
    }
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    await analyzeFile(file);
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await analyzeFile(file);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 shadow-sm">
          <label className="mb-3 block text-sm font-semibold text-slate-900 dark:text-slate-100">Upload your resume</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
            onChange={onFileSelected}
          />
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
            aria-disabled={uploading}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
              dragActive ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-900' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            } ${uploading ? 'pointer-events-none opacity-70' : 'cursor-pointer'}`}
          >
            {uploading ? (
              <Loader2 size={28} className="animate-spin text-slate-400 dark:text-slate-500" />
            ) : (
              <Upload size={28} className="text-slate-400 dark:text-slate-500" />
            )}
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {uploading ? 'Reading your resume…' : 'Drag & drop your resume here, or click to browse'}
            </p>
            <p className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <FileText size={12} /> PDF, DOCX, or TXT — up to 10MB
            </p>
          </div>
          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

        {analysis && (
          <div className="mt-6 rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 shadow-sm">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">ATS resume score</h2>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{analysis.resumeScore}/100</span>
            </div>
            <ScoreBar score={analysis.resumeScore} />

            {(analysis.scoreBreakdown?.length ?? 0) > 0 && (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {analysis.scoreBreakdown.map((c) => (
                  <div key={c.key}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600 dark:text-slate-400">{c.label}</span>
                      <span className="text-slate-400 dark:text-slate-500">
                        {c.score}/{c.max}
                      </span>
                    </div>
                    <MiniBar score={c.score} max={c.max} />
                  </div>
                ))}
              </div>
            )}

            {(analysis.extractedSkillSlugs?.length ?? 0) > 0 && (
              <div className="mt-5">
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Skills detected
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.extractedSkillSlugs?.map((s) => (
                    <span key={s} className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(analysis.suggestions?.length ?? 0) > 0 && (
              <div className="mt-5">
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Suggestions to improve
                </h3>
                <ul className="space-y-1.5">
                  {analysis.suggestions?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-500" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <aside>
        <div className="sticky top-24 rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Recommended jobs for you</h2>
          {!analysis && <p className="text-sm text-slate-500 dark:text-slate-400">Upload your resume to see matching open roles.</p>}
          {analysis && loadingJobs && <Loader2 size={16} className="animate-spin text-slate-400 dark:text-slate-500" />}
          {analysis && !loadingJobs && recommended?.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No matching roles yet — add more of your specific skills to your resume so we can match you to open jobs.
            </p>
          )}
          {recommended && recommended.length > 0 && (
            <ul className="space-y-3">
              {recommended.map((j) => (
                <li key={j.id}>
                  <Link
                    href={`/jobs/${j.slug}`}
                    className="block rounded-lg border border-slate-100 dark:border-slate-800 p-3 transition-colors hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{j.title}</span>
                      <MatchBadge score={j.matchScore} />
                    </div>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {j.company?.name && (
                        <span className="flex items-center gap-1">
                          <Building2 size={12} /> {j.company.name}
                        </span>
                      )}
                      {j.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {j.location}
                        </span>
                      )}
                    </p>
                    {j.matchingSkills?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {j.matchingSkills.slice(0, 4).map((s) => (
                          <span
                            key={s.slug}
                            className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
                          >
                            {s.name}
                          </span>
                        ))}
                        {j.matchingSkillCount > 4 && (
                          <span className="rounded-full bg-slate-50 dark:bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            +{j.matchingSkillCount - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
