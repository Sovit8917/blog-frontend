'use client';

import { useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { updateOwnPreferences } from '@/lib/api/users';
import { ApiRequestError } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  EMPLOYMENT_TYPE_LABEL,
  EXPERIENCE_LEVEL_LABEL,
  REMOTE_TYPE_LABEL,
} from '@/lib/jobs/format';
import type { CandidatePreferences, EmploymentType, ExperienceLevel, RemoteType } from '@/types';

const fieldClass =
  'w-full rounded-lg border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm text-ink-800 dark:text-ink-200 outline-none focus:border-brand-400 dark:focus:border-brand-600';

export function PreferencesPanel({ initial }: { initial: CandidatePreferences | null }) {
  const [location, setLocation] = useState(initial?.preferredLocation ?? '');
  const [remoteType, setRemoteType] = useState<RemoteType | ''>(initial?.preferredRemoteType ?? '');
  const [employmentType, setEmploymentType] = useState<EmploymentType | ''>(
    initial?.preferredEmploymentType ?? '',
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | ''>(
    initial?.preferredExperienceLevel ?? '',
  );
  const [salaryMin, setSalaryMin] = useState(initial?.expectedSalaryMin?.toString() ?? '');
  const [salaryMax, setSalaryMax] = useState(initial?.expectedSalaryMax?.toString() ?? '');
  const [skills, setSkills] = useState<string[]>(initial?.preferredSkillSlugs ?? []);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function addSkill() {
    const slug = skillInput
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    if (!slug || skills.includes(slug)) {
      setSkillInput('');
      return;
    }
    setSkills((prev) => [...prev, slug]);
    setSkillInput('');
  }

  function removeSkill(slug: string) {
    setSkills((prev) => prev.filter((s) => s !== slug));
  }

  async function onSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateOwnPreferences({
        preferredLocation: location.trim() || undefined,
        preferredRemoteType: remoteType || undefined,
        preferredEmploymentType: employmentType || undefined,
        preferredExperienceLevel: experienceLevel || undefined,
        expectedSalaryMin: salaryMin ? Number(salaryMin) : undefined,
        expectedSalaryMax: salaryMax ? Number(salaryMax) : undefined,
        preferredSkillSlugs: skills,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not save your preferences.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-ink-100 dark:border-ink-800 p-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">Preferred location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Bengaluru, or Remote"
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">Work style</label>
          <select value={remoteType} onChange={(e) => setRemoteType(e.target.value as RemoteType | '')} className={fieldClass}>
            <option value="">Any</option>
            {Object.entries(REMOTE_TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">Employment type</label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as EmploymentType | '')}
            className={fieldClass}
          >
            <option value="">Any</option>
            {Object.entries(EMPLOYMENT_TYPE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">Experience level</label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel | '')}
            className={fieldClass}
          >
            <option value="">Any</option>
            {Object.entries(EXPERIENCE_LEVEL_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">Min expected salary</label>
          <input
            type="number"
            min={0}
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">Max expected salary</label>
          <input
            type="number"
            min={0}
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">
          Skills
          <span className="ml-1.5 font-normal text-ink-400 dark:text-ink-500">
            — used to match you with roles (press Enter to add)
          </span>
        </label>
        <div className="flex flex-wrap gap-1.5 rounded-lg border border-ink-200 dark:border-ink-700 p-2">
          {skills.map((s) => (
            <Badge key={s} variant="outline" className="gap-1.5">
              {s}
              <button onClick={() => removeSkill(s)} className="text-ink-400 dark:text-ink-500 hover:text-red-600 dark:hover:text-red-400">
                <X size={12} />
              </button>
            </Badge>
          ))}
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill…"
            className="min-w-[120px] flex-1 border-none bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {saved && !error && <p className="text-sm text-emerald-600 dark:text-emerald-400">Preferences saved.</p>}

      <Button onClick={onSave} disabled={saving} className="self-start">
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {saving ? 'Saving…' : 'Save preferences'}
      </Button>
    </div>
  );
}
