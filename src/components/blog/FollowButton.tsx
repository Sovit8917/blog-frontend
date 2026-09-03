'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/api/client';

/**
 * Optimistic follow/unfollow control for author profile pages. Talks to
 * `POST /users/:username/follow` (toggle, requires auth — same
 * `credentials: 'include'` cookie-session pattern as `LikeBookmarkBar`).
 *
 * `isOwnProfile` hides the button entirely (you can't follow yourself — the
 * backend rejects it with a 400 anyway, but there's no reason to show it).
 * `isLoggedIn` false renders a button that sends the visitor to /login
 * instead of guessing at a request that would just 401.
 */
export function FollowButton({
  username,
  initialFollowing,
  initialFollowerCount,
  isLoggedIn,
  isOwnProfile,
  hideCount = false,
}: {
  username: string;
  initialFollowing: boolean;
  initialFollowerCount: number;
  isLoggedIn: boolean;
  isOwnProfile: boolean;
  /** Article byline usage doesn't have a follower count to show — hide the label instead of showing a misleading 0. */
  hideCount?: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [isPending, startTransition] = useTransition();

  if (isOwnProfile) return null;

  const onClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?next=/author/${username}`);
      return;
    }
    if (isPending) return;

    const wasFollowing = following;
    setFollowing(!wasFollowing);
    setFollowerCount((n) => (wasFollowing ? n - 1 : n + 1));

    startTransition(async () => {
      try {
        // apiFetch already targets the backend's `/api/v1` prefix and unwraps
        // the `{ success, data }` envelope, so `body` here is the raw payload.
        const body = await apiFetch<{ following: boolean }>(`/users/${username}/follow`, {
          method: 'POST',
          revalidate: false,
        });
        const nowFollowing: boolean = body?.following ?? !wasFollowing;
        setFollowing(nowFollowing);
      } catch {
        // Roll back on failure.
        setFollowing(wasFollowing);
        setFollowerCount((n) => (wasFollowing ? n + 1 : n - 1));
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onClick}
        disabled={isPending}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 transition disabled:opacity-60',
          following
            ? 'bg-ink-50 dark:bg-ink-900 text-ink-700 dark:text-ink-300 ring-ink-200 dark:ring-ink-700 hover:bg-ink-100 dark:hover:bg-ink-800'
            : 'bg-slate-950 text-white ring-slate-950 dark:ring-slate-50 hover:bg-slate-900',
        )}
      >
        {following ? <UserCheck size={16} /> : <UserPlus size={16} />}
        {following ? 'Following' : 'Follow'}
      </button>
      {!hideCount && (
        <span className="text-sm text-ink-500 dark:text-ink-400">
          {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
        </span>
      )}
    </div>
  );
}
