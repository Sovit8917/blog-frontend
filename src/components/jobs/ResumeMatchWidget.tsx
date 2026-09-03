'use client';

import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { analyzeResume, getResumeJobMatch } from '@/lib/api/resume-ats';
import { ApiRequestError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import type { ResumeJobMatch } from '@/types';

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? 'text-emerald-600 dark:text-emerald-400' : score >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
  return (
    <div className={`text-3xl font-bold ${color}`}>
      {score}
      <span className="text-base font-medium text-slate-400 dark:text-slate-500">/100</span>
    </div>
  );
}

/**
 * Candidate ATS (P2) — lets a logged-in job seeker paste their resume once
 * and instantly see how it matches THIS job's required skills, without
 * leaving the job page. Not signed in / no resume yet -> shows the paste
 * form inline; already analyzed -> shows the match immediately.
 */
export function ResumeMatchWidget({ jobSlug, isLoggedIn }: { jobSlug: string; isLoggedIn: boolean }) {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<ResumeJobMatch | null>(null);
  const [needsResume, setNeedsResume] = useState(false);

  const checkExisting = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getResumeJobMatch(jobSlug);
      setMatch(result);
    } catch (err) {
      if (err instanceof ApiRequestError && err.statusCode === 404) {
        setNeedsResume(true);
      } else {
        setError(err instanceof ApiRequestError ? err.message : 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  const submitResume = async () => {
    if (resumeText.trim().length < 50) {
      setError('Paste your full resume text (at least a few sentences) to analyze it.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await analyzeResume(resumeText);
      const result = await getResumeJobMatch(jobSlug);
      setMatch(result);
      setNeedsResume(false);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not analyze that resume.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          <Sparkles size={16} className="text-brand-600 dark:text-brand-400" /> Resume match score
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to see how your resume matches this job&apos;s required skills.</p>
      </div>
    );
  }

  if (match) {
    return (
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          <Sparkles size={16} className="text-brand-600 dark:text-brand-400" /> Your match for this job
        </div>
        <ScoreRing score={match.jobMatchScore} />
        {match.matchingSkills.length > 0 && (
          <div className="mt-3 space-y-1">
            {match.matchingSkills.map((s) => (
              <div key={s.slug} className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 size={14} /> {s.name}
              </div>
            ))}
          </div>
        )}
        {match.missingSkills.length > 0 && (
          <div className="mt-1 space-y-1">
            {match.missingSkills.map((s) => (
              <div key={s.slug} className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <XCircle size={14} /> {s.name}
              </div>
            ))}
          </div>
        )}
        {match.suggestions[0] && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{match.suggestions[0]}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-ink-900 p-6 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
        <Sparkles size={16} className="text-brand-600 dark:text-brand-400" /> Resume match score
      </div>

      {!needsResume ? (
        <>
          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">See how your resume matches this job&apos;s required skills.</p>
          <Button size="sm" variant="outline" onClick={checkExisting} disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : null} Check my match
          </Button>
        </>
      ) : (
        <>
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Paste your resume text to get a match score for this job.</p>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={6}
            placeholder="Paste your resume text here…"
            className="mb-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 text-sm"
          />
          <Button size="sm" onClick={submitResume} disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : null} Analyze & match
          </Button>
        </>
      )}
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
