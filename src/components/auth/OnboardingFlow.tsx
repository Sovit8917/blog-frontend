'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { listCategories } from '@/lib/api/taxonomy';
import { toggleTopicFollow } from '@/lib/api/growth';
import { updateOwnProfile, uploadOwnAvatar } from '@/lib/api/users';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

type OptionalField = 'bio' | 'avatar' | 'interests';

const FIELD_OPTIONS: { id: OptionalField; label: string; blurb: string }[] = [
  { id: 'bio', label: 'Bio', blurb: 'A short line about you' },
  { id: 'avatar', label: 'Profile photo', blurb: 'Add a picture' },
  { id: 'interests', label: 'Interests', blurb: 'Topics you want more of' },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<'choose' | 'fill'>('choose');
  const [chosen, setChosen] = useState<Set<OptionalField>>(new Set());

  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chosen.has('interests') || categories.length > 0) return;
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [chosen, categories.length]);

  const toggleField = (id: OptionalField) => {
    setChosen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategory = (slug: string) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const onPickAvatar = (file: File | null) => {
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };

  // A lightweight "you might also like" rail — once someone has picked a
  // couple of interests, nudge them toward a few more they haven't
  // selected yet, rather than leaving them to scroll the full list.
  const suggestedCategories = useMemo(() => {
    if (selectedSlugs.size === 0) return [];
    return categories.filter((c) => !selectedSlugs.has(c.slug)).slice(0, 6);
  }, [categories, selectedSlugs]);

  const finish = () => router.push('/');

  const onSave = async () => {
    setError(null);
    setSaving(true);
    try {
      if (chosen.has('bio') && bio.trim()) {
        await updateOwnProfile({ bio: bio.trim() });
      }
      if (chosen.has('avatar') && avatarFile) {
        await uploadOwnAvatar(avatarFile);
      }
      if (chosen.has('interests') && selectedSlugs.size > 0) {
        await Promise.all(Array.from(selectedSlugs).map((slug) => toggleTopicFollow(slug)));
      }
      finish();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong saving your profile.');
    } finally {
      setSaving(false);
    }
  };

  if (step === 'choose') {
    return (
      <div className="w-full max-w-md">
        <p className="mb-4 text-center text-sm font-medium text-ink-700 dark:text-ink-300">
          What would you like to add?
        </p>
        <div className="flex flex-col gap-3">
          {FIELD_OPTIONS.map((opt) => {
            const active = chosen.has(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleField(opt.id)}
                className={cn(
                  'flex items-center justify-between rounded-xl border px-4 py-3 text-left transition',
                  active
                    ? 'border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-900/30'
                    : 'border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800/50',
                )}
              >
                <span>
                  <span className="block text-sm font-semibold text-ink-900 dark:text-ink-100">{opt.label}</span>
                  <span className="block text-xs text-ink-500 dark:text-ink-400">{opt.blurb}</span>
                </span>
                {active && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white">
                    <Check size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="outline" onClick={finish} className="flex-1">
            Skip for now
          </Button>
          <Button
            type="button"
            onClick={() => setStep('fill')}
            disabled={chosen.size === 0}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-6">
        {chosen.has('avatar') && (
          <div className="flex flex-col items-center gap-3">
            <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-ink-300 bg-ink-50 dark:border-ink-600 dark:bg-ink-800">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Avatar preview" fill className="object-cover" unoptimized />
              ) : (
                <Camera size={22} className="text-ink-400" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => onPickAvatar(e.target.files?.[0] ?? null)}
              />
            </label>
            <span className="text-xs text-ink-500 dark:text-ink-400">Tap to choose a photo</span>
          </div>
        )}

        {chosen.has('bio') && (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink-700 dark:text-ink-300">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Tell people a bit about yourself…"
              className="rounded-lg border border-ink-200 dark:border-ink-700 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 dark:placeholder:text-ink-500 focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
            />
          </label>
        )}

        {chosen.has('interests') && (
          <div>
            <span className="text-sm font-medium text-ink-700 dark:text-ink-300">Interests</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = selectedSlugs.has(c.slug);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategory(c.slug)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-sm transition',
                      active
                        ? 'border-brand-400 bg-brand-500 text-white'
                        : 'border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800/50',
                    )}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>

            {suggestedCategories.length > 0 && (
              <div className="mt-4">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">
                  You might also like
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedCategories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCategory(c.slug)}
                      className="rounded-full border border-dashed border-ink-200 dark:border-ink-700 px-3 py-1.5 text-sm text-ink-500 dark:text-ink-400 transition hover:border-brand-400 hover:text-brand-600"
                    >
                      + {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-6 flex gap-3">
        <Button type="button" variant="outline" onClick={finish} className="flex-1">
          Skip for now
        </Button>
        <Button type="button" onClick={onSave} disabled={saving} className="flex-1">
          {saving ? 'Saving…' : 'Save & continue'}
        </Button>
      </div>
    </div>
  );
}
