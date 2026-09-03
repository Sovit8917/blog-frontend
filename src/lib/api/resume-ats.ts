import { apiFetch, ApiRequestError, API_BASE } from './client';
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

/** POST /me/resume-ats/analyze-file — upload a PDF/DOCX/TXT resume, get an instant score + tips. */
export async function analyzeResumeFile(file: File): Promise<ResumeAnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/me/resume-ats/analyze-file`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) {
    let payload;
    try {
      payload = await res.json();
    } catch {
      payload = { statusCode: res.status, message: res.statusText };
    }
    throw new ApiRequestError(payload);
  }

  return res.json();
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