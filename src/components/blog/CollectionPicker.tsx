"use client";

import { useEffect, useRef, useState } from "react";
import { FolderPlus, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  collectionsContainingPost,
  createCollection,
  addPostToCollection,
  removePostFromCollection,
} from "@/lib/api/collections";
import type { CollectionMembership } from "@/types";

/**
 * "Save to collection" popover next to the bookmark button. Lazy-loads the
 * viewer's collections (with membership state for this post) on first open,
 * lets them toggle membership, or spin up a new named collection inline.
 * Requires auth the same way LikeBookmarkBar's bookmark button does.
 */
export function CollectionPicker({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<CollectionMembership[] | null>(
    null,
  );
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await collectionsContainingPost(postId);
      setCollections(data);
    } catch {
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && collections === null) load();
  };

  const toggleMembership = async (c: CollectionMembership) => {
    setCollections((prev) =>
      prev
        ? prev.map((x) => (x.id === c.id ? { ...x, contains: !x.contains } : x))
        : prev,
    );
    try {
      if (c.contains) await removePostFromCollection(c.id, postId);
      else await addPostToCollection(c.id, postId);
    } catch {
      // roll back on failure
      setCollections((prev) =>
        prev
          ? prev.map((x) =>
              x.id === c.id ? { ...x, contains: c.contains } : x,
            )
          : prev,
      );
    }
  };

  const onCreate = async () => {
    if (!newName.trim() || creating) return;
    setCreating(true);
    try {
      const created = await createCollection({ name: newName.trim() });
      await addPostToCollection(created.id, postId);
      setCollections((prev) => [
        {
          id: created.id,
          name: created.name,
          slug: created.slug,
          contains: true,
        },
        ...(prev ?? []),
      ]);
      setNewName("");
    } catch {
      // no-op — keep the typed name so the user can retry
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        aria-label="Save to collection"
        className="flex h-9 w-9 sm:h-9.5 sm:w-9.5 items-center justify-center rounded-xl text-xs font-semibold text-ink-600 dark:text-ink-400 border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-ink-900 shadow-2xs transition hover:opacity-90 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-ink-800 active:scale-95"
      >
        <FolderPlus size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-3 shadow-lg">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-500">
            Save to collection
          </p>

          {loading && (
            <div className="flex items-center justify-center py-4 text-ink-400 dark:text-ink-500">
              <Loader2 size={16} className="animate-spin" />
            </div>
          )}

          {!loading && collections && collections.length === 0 && (
            <p className="mb-2 text-sm text-ink-500 dark:text-ink-400">
              No collections yet — create one below.
            </p>
          )}

          {!loading && collections && collections.length > 0 && (
            <ul className="mb-2 max-h-48 space-y-0.5 overflow-y-auto">
              {collections.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => toggleMembership(c)}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
                  >
                    <span className="truncate">{c.name}</span>
                    {c.contains && (
                      <Check
                        size={14}
                        className="shrink-0 text-brand-600 dark:text-brand-400"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-1.5 border-t border-ink-100 dark:border-ink-800 pt-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onCreate()}
              placeholder="New collection name"
              className="min-w-0 flex-1 rounded-lg border border-ink-200 dark:border-ink-700 px-2 py-1.5 text-sm outline-none focus:border-brand-400 dark:focus:border-brand-600"
            />
            <button
              onClick={onCreate}
              disabled={!newName.trim() || creating}
              className={cn(
                "shrink-0 rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-900 disabled:opacity-50",
              )}
            >
              {creating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
