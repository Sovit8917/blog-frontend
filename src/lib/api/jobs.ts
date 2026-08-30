import { apiFetch, qs } from './client';
import type {
  ApplicationStatus,
  CreateJobAlertInput,
  CursorPage,
  Job,
  JobAlert,
  JobApplication,
  JobCard,
  ListJobsParams,
  RecommendedJobs,
  SavedJob,
} from '@/types';

/** GET /jobs — public job board, cursor-paginated. */
export function listJobs(params: ListJobsParams = {}) {
  return apiFetch<CursorPage<JobCard>>(`/jobs${qs(params as Record<string, any>)}`, {
    revalidate: 60,
    tags: ['jobs'],
  });
}

/** GET /jobs/related-to-post/:postId — public. Skill-matched to the article's tags. */
export function listJobsRelatedToPost(postId: string, limit = 3) {
  return apiFetch<JobCard[]>(`/jobs/related-to-post/${postId}?limit=${limit}`, {
    revalidate: 120,
    tags: ['jobs', `jobs-related:${postId}`],
  }).catch(() => []);
}

/** GET /jobs?skill=slug — jobs for a given skill (used by the Developer Resources pages). */
export function listJobsBySkill(skillSlug: string, params: ListJobsParams = {}) {
  return listJobs({ ...params, skill: skillSlug });
}

/** GET /jobs?company=slug */
export function listJobsByCompany(companySlug: string, params: ListJobsParams = {}) {
  return listJobs({ ...params, company: companySlug });
}

/** GET /jobs/:slug — full job detail. */
export function getJobBySlug(slug: string) {
  return apiFetch<Job>(`/jobs/${slug}`, { revalidate: 60, tags: ['jobs', `job:${slug}`] });
}

/** POST /jobs/:jobId/apply — requires auth (cookie session). */
export function applyToJob(jobId: string, input: { resumeUrl?: string; coverLetter?: string }) {
  return apiFetch<JobApplication>(`/jobs/${jobId}/apply`, {
    method: 'POST',
    body: JSON.stringify(input),
    revalidate: false,
  });
}

/** DELETE /me/applications/:id — withdraw an application. */
export function withdrawApplication(id: string) {
  return apiFetch<{ message: string }>(`/me/applications/${id}`, {
    method: 'DELETE',
    revalidate: false,
  });
}

/** GET /me/applications — the current user's job applications. */
export function myApplications(cookie?: string) {
  return apiFetch<JobApplication[]>('/me/applications', { revalidate: false, cookie });
}

/** POST /jobs/:jobId/save — toggle save, requires auth. */
export function toggleSaveJob(jobId: string) {
  return apiFetch<{ saved: boolean }>(`/jobs/${jobId}/save`, {
    method: 'POST',
    revalidate: false,
  });
}

/** GET /me/saved-jobs — the current user's saved jobs. */
export function mySavedJobs(cookie?: string) {
  return apiFetch<SavedJob[]>('/me/saved-jobs', { revalidate: false, cookie });
}

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  SUBMITTED: 'Submitted',
  REVIEWED: 'Reviewed',
  SHORTLISTED: 'Shortlisted',
  REJECTED: 'Not selected',
  HIRED: 'Hired',
  WITHDRAWN: 'Withdrawn',
};

// ---- Personalized jobs (#20) ----

/** GET /jobs/recommended — requires auth. "Jobs for you" section. */
export function getRecommendedJobs(cookie?: string, limit?: number) {
  return apiFetch<RecommendedJobs>(`/jobs/recommended${qs({ limit })}`, {
    revalidate: false,
    cookie,
  }).catch(() => ({ items: [], personalized: false }) as RecommendedJobs);
}

// ---- Job alerts (#19) ----

/** GET /job-alerts — the current user's saved searches. */
export function myJobAlerts(cookie?: string) {
  return apiFetch<JobAlert[]>('/job-alerts', { revalidate: false, cookie });
}

/** POST /job-alerts — save the current /jobs filter state as an alert. */
export function createJobAlert(input: CreateJobAlertInput) {
  return apiFetch<JobAlert>('/job-alerts', {
    method: 'POST',
    body: JSON.stringify(input),
    revalidate: false,
  });
}

/** PATCH /job-alerts/:id */
export function updateJobAlert(id: string, input: Partial<CreateJobAlertInput>) {
  return apiFetch<JobAlert>(`/job-alerts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
    revalidate: false,
  });
}

/** DELETE /job-alerts/:id */
export function deleteJobAlert(id: string) {
  return apiFetch<{ message: string }>(`/job-alerts/${id}`, { method: 'DELETE', revalidate: false });
}

/** GET /job-alerts/:id/preview — jobs currently matching this alert. */
export function previewJobAlert(id: string) {
  return apiFetch<JobCard[]>(`/job-alerts/${id}/preview`, { revalidate: false });
}
