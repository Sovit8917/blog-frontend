"use client";

import { useState } from "react";
import { Heart, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import { CollectionPicker } from "./CollectionPicker";

/**
 * Optimistic like/bookmark control. Talks to POST /posts/:id/like and
 * POST /posts/:id/bookmark — both require auth; unauthenticated clicks route
 * to /login (wire up real auth-token retrieval when the auth module lands).
 */
export function LikeBookmarkBar({
  postId,
  initialLikes,
  initialLiked = false,
  initialBookmarked = false,
}: {
  postId: string;
  initialLikes: number;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  const onLike = () => {
    setLiked((v) => !v);
    setLikes((n) => (liked ? n - 1 : n + 1));
    // apiFetch throws on a non-2xx response (a plain fetch() would not — it only
    // rejects on a network error — so a 404/401 here used to fail silently
    // while the UI still showed the optimistic "liked" state).
    apiFetch(`/posts/${postId}/like`, {
      method: "POST",
      revalidate: false,
    }).catch(() => {
      setLiked((v) => !v);
      setLikes((n) => (liked ? n + 1 : n - 1));
    });
  };

  const onBookmark = () => {
    setBookmarked((v) => !v);
    apiFetch(`/posts/${postId}/bookmark`, {
      method: "POST",
      revalidate: false,
    }).catch(() => setBookmarked((v) => !v));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onLike}
        className={cn(
          "flex h-9 sm:h-9.5 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold border shadow-2xs transition hover:opacity-90 active:scale-95",
          liked
            ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 ring-1 ring-red-200 dark:ring-red-800"
            : "text-ink-600 dark:text-ink-400 border-slate-200/90 dark:border-slate-700 bg-white dark:bg-ink-900 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-ink-800",
        )}
      >
        <Heart size={15} className={liked ? "fill-red-500 text-red-500" : ""} />
        {likes}
      </button>
      <button
        onClick={onBookmark}
        aria-label="Bookmark"
        className={cn(
          "flex h-9 w-9 sm:h-9.5 sm:w-9.5 items-center justify-center rounded-xl text-xs font-semibold border shadow-2xs transition hover:opacity-90 active:scale-95",
          bookmarked
            ? "bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800 ring-1 ring-brand-200 dark:ring-brand-800"
            : "text-ink-600 dark:text-ink-400 border-slate-200/90 dark:border-slate-700 bg-white dark:bg-ink-900 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-ink-800",
        )}
      >
        <Bookmark
          size={15}
          className={
            bookmarked
              ? "fill-brand-500 text-brand-500 dark:text-brand-400"
              : ""
          }
        />
      </button>
      <CollectionPicker postId={postId} />
    </div>
  );
}
