'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleSaveJob } from '@/lib/api/jobs';

export function UnsaveJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    setPending(true);
    try {
      await toggleSaveJob(jobId);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition hover:bg-ink-50 disabled:opacity-50"
    >
      Remove
    </button>
  );
}
