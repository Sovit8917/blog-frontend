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

/**
 * A job either links to a real Company record (`job.company`) or was posted
 * with a manually-typed name/logo (`job.companyName`/`companyLogoUrl`) for
 * external/off-platform postings. This is the single place that resolves
 * which one to show, so cards/rows/detail pages never have to branch on it
 * themselves.
 */
export function getJobCompany(job: {
  company?: { name: string; slug: string; logoUrl?: string | null; isVerified?: boolean } | null;
  companyName?: string | null;
  companyLogoUrl?: string | null;
}) {
  if (job.company) {
    return {
      name: job.company.name,
      logoUrl: job.company.logoUrl ?? null,
      isVerified: job.company.isVerified ?? false,
      slug: job.company.slug as string | null,
    };
  }
  return {
    name: job.companyName || 'Company',
    logoUrl: job.companyLogoUrl ?? null,
    isVerified: false,
    slug: null as string | null,
  };
}
