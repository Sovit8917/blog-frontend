import { apiFetch, qs } from './client';
import type {
  ApplicationStatus,
  CursorPage,
  Job,
  JobApplication,
  JobCard,
  ListJobsParams,
  SavedJob,
} from '@/types';

/** GET /jobs — public job board, cursor-paginated. */
export function listJobs(params: ListJobsParams = {}) {
  return apiFetch<CursorPage<JobCard>>(`/jobs${qs(params as Record<string, any>)}`, {
    revalidate: 60,
    tags: ['jobs'],
  });
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
