'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { removePostFromCollection } from '@/lib/api';

export function RemoveFromCollectionButton({
  collectionId,
  postId,
}: {
  collectionId: string;
  postId: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    setPending(true);
    try {
      await removePostFromCollection(collectionId, postId);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={pending}
      aria-label="Remove from collection"
      className="rounded-lg p-2 text-ink-400 dark:text-ink-500 transition hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
    >
      <X size={15} />
    </button>
  );
}
