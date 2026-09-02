import { apiFetch } from './client';
import type { ResumeAnalysisResult, ResumeJobMatch, ResumeRecommendedJob } from '@/types';

/**
 * Candidate ATS (P2) — heuristic resume scoring, per-job match scoring, and
 * resume -> job recommendations. All require login; the backend reads the
 * logged-in user's own saved analysis (`/me/resume-ats/*`), so these are
 * client-side calls (cookie session attached automatically).
 */

/** POST /me/resume-ats/analyze — paste resume text, get an instant score + tips. */
export function analyzeResume(resumeText: string) {
  return apiFetch<ResumeAnalysisResult>('/me/resume-ats/analyze', {
    method: 'POST',
    body: JSON.stringify({ resumeText }),
    revalidate: false,
  });
}

/** GET /me/resume-ats — the latest saved analysis, if one exists (404 if not analyzed yet). */
export function getLatestResumeAnalysis(cookie?: string) {
  return apiFetch<ResumeAnalysisResult>('/me/resume-ats', { revalidate: false, cookie });
}

/** GET /me/resume-ats/match/:jobSlug — resume-vs-job match score, matching/missing skills. */
export function getResumeJobMatch(jobSlug: string, cookie?: string) {
  return apiFetch<ResumeJobMatch>(`/me/resume-ats/match/${jobSlug}`, { revalidate: false, cookie });
}

/** GET /me/resume-ats/recommended-jobs — open jobs ranked by skill overlap with the resume. */
export function getResumeRecommendedJobs(limit = 10, cookie?: string) {
  return apiFetch<ResumeRecommendedJob[]>(`/me/resume-ats/recommended-jobs?limit=${limit}`, {
    revalidate: false,
    cookie,
  });
}
