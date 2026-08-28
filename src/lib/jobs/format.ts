import type { EmploymentType, ExperienceLevel, RemoteType } from '@/types';

export const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
};

export const REMOTE_TYPE_LABEL: Record<RemoteType, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ONSITE: 'On-site',
};

export const EXPERIENCE_LEVEL_LABEL: Record<ExperienceLevel, string> = {
  INTERNSHIP: 'Internship',
  ENTRY_LEVEL: 'Entry level',
  MID_LEVEL: 'Mid level',
  SENIOR_LEVEL: 'Senior level',
  LEAD: 'Lead',
  EXECUTIVE: 'Executive',
};

export function formatSalaryRange(
  min?: number | null,
  max?: number | null,
  currency = 'USD',
): string | null {
  if (min == null && max == null) return null;
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `From ${fmt(min)}`;
  return `Up to ${fmt(max as number)}`;
}
