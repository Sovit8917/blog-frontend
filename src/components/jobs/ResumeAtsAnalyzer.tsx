'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { analyzeResume, getLatestResumeAnalysis, getResumeRecommendedJobs } from '@/lib/api/resume-ats';
import { ApiRequestError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import type { ResumeAnalysisResult, ResumeRecommendedJob } from '@/types';

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full ${color}`} style={{ width: `${score}%` }} />
    </div>
  );
}

export function ResumeAtsAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [recommended, setRecommended] = useState<ResumeRecommendedJob[] | null>(null);

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

  const submit = async () => {
    if (resumeText.trim().length < 50) {
      setError('Paste your full resume text — at least a few sentences — to analyze it.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeResume(resumeText);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not analyze that resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-900">
            Paste your resume text
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={14}
            placeholder="Paste the full text of your resume here…"
            className="w-full rounded-lg border border-slate-200 p-3 text-sm"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <Button className="mt-3" onClick={submit} disabled={loading}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            {analysis ? 'Re-analyze' : 'Analyze my resume'}
          </Button>
        </div>

        {analysis && (
          <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Resume score</h2>
              <span className="text-2xl font-bold text-slate-900">{analysis.resumeScore}/100</span>
            </div>
            <ScoreBar score={analysis.resumeScore} />

            {analysis.extractedSkillSlugs.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Skills detected
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.extractedSkillSlugs.map((s) => (
                    <span key={s} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.suggestions.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Suggestions to improve
                </h3>
                <ul className="space-y-1.5">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
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
        <div className="sticky top-24 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Recommended jobs for you</h2>
          {!analysis && <p className="text-sm text-slate-500">Analyze your resume to see matching open roles.</p>}
          {analysis && loadingJobs && <Loader2 size={16} className="animate-spin text-slate-400" />}
          {analysis && !loadingJobs && recommended?.length === 0 && (
            <p className="text-sm text-slate-500">No strong matches yet — try adding more skills to your resume.</p>
          )}
          {recommended && recommended.length > 0 && (
            <ul className="space-y-3">
              {recommended.map((j) => (
                <li key={j.id}>
                  <Link href={`/jobs/${j.slug}`} className="block rounded-lg border border-slate-100 p-3 hover:border-slate-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-slate-900">{j.title}</span>
                      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 size={12} /> {j.matchScore}%
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{j.company?.name ?? 'Company'} {j.location ? `· ${j.location}` : ''}</p>
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
