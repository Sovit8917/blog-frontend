'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { createCollection } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export function CreateCollectionForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setPending(true);
    setError(null);
    try {
      await createCollection({ name: name.trim(), description: description.trim() || undefined, isPrivate });
      setName('');
      setDescription('');
      setIsPrivate(false);
      setOpen(false);
      router.refresh();
    } catch {
      setError('Could not create the collection. Try again.');
    } finally {
      setPending(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="md">
        <Plus size={16} /> New collection
      </Button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-5 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink-900">New collection</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cancel"
          className="rounded-md p-1 text-ink-400 hover:bg-ink-50 hover:text-ink-700"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <input
          autoFocus
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Interview prep reading list"
          className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="w-full resize-none rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400"
          />
          Keep this collection private
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={pending || !name.trim()}>
          {pending ? 'Creating…' : 'Create collection'}
        </Button>
      </div>
    </form>
  );
}
