'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { toggleSaveJob } from '@/lib/api/jobs';
import { cn } from '@/lib/utils';

export function SaveJobButton({ jobId, initialSaved = false }: { jobId: string; initialSaved?: boolean }) {
  const { user } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    if (!user) {
      router.push(`/login?redirect=/jobs`);
      return;
    }
    setPending(true);
    setSaved((v) => !v);
    try {
      await toggleSaveJob(jobId);
    } catch {
      setSaved((v) => !v);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={pending}
      aria-label={saved ? 'Unsave job' : 'Save job'}
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium ring-1 transition',
        saved ? 'bg-brand-50 text-brand-700 ring-brand-200' : 'text-ink-600 ring-ink-200 hover:bg-ink-50',
      )}
    >
      <Bookmark size={16} className={saved ? 'fill-brand-500 text-brand-500' : ''} />
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
