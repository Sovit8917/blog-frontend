import { apiFetch } from './client';
import type { Skill } from '@/types';

/**
 * GET /skills — the "Developer Resources" directory: every tech/skill tag
 * jobs can be tagged with, each with a job count. There's no dedicated
 * `/skills/:slug` detail endpoint on the backend, so the per-skill page
 * resolves the skill from this list and fetches its jobs via `GET /jobs?skill=`.
 */
export function listSkills() {
  return apiFetch<Skill[]>('/skills', { revalidate: 300, tags: ['skills'] });
}

export function getSkillBySlug(slug: string) {
  return listSkills().then((skills) => skills.find((s) => s.slug === slug) ?? null);
}
