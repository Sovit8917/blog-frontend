'use client';

import { useState } from 'react';
import { Heart, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/api/client';
import { CollectionPicker } from './CollectionPicker';

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
    apiFetch(`/posts/${postId}/like`, { method: 'POST', revalidate: false }).catch(() => {
      setLiked((v) => !v);
      setLikes((n) => (liked ? n + 1 : n - 1));
    });
  };

  const onBookmark = () => {
    setBookmarked((v) => !v);
    apiFetch(`/posts/${postId}/bookmark`, { method: 'POST', revalidate: false }).catch(() =>
      setBookmarked((v) => !v),
    );
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onLike}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition',
          liked ? 'bg-red-50 text-red-600 ring-red-200' : 'text-ink-600 ring-ink-200 hover:bg-ink-50',
        )}
      >
        <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : ''} />
        {likes}
      </button>
      <button
        onClick={onBookmark}
        aria-label="Bookmark"
        className={cn(
          'flex items-center gap-1.5 rounded-full p-2 ring-1 transition',
          bookmarked ? 'bg-brand-50 text-brand-600 ring-brand-200' : 'text-ink-600 ring-ink-200 hover:bg-ink-50',
        )}
      >
        <Bookmark size={16} className={bookmarked ? 'fill-brand-500 text-brand-500' : ''} />
      </button>
      <CollectionPicker postId={postId} />
    </div>
  );
}
