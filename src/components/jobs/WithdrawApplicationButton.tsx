'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { withdrawApplication } from '@/lib/api/jobs';

export function WithdrawApplicationButton({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    if (!confirm('Withdraw this application?')) return;
    setPending(true);
    try {
      await withdrawApplication(applicationId);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
    >
      Withdraw
    </button>
  );
}
