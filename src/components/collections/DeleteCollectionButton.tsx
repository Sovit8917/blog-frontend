'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteCollection } from '@/lib/api';

export function DeleteCollectionButton({
  collectionId,
  redirectTo,
}: {
  collectionId: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    if (!confirm('Delete this collection? This cannot be undone.')) return;
    setPending(true);
    try {
      await deleteCollection(collectionId);
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 size={14} /> Delete
    </button>
  );
}
