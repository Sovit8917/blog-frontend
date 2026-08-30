'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/api/client';

/**
 * Follow/unfollow a Category ("Topic") — same optimistic toggle pattern as
 * FollowButton (author follows), talking to `POST /categories/:slug/follow`.
 * Meant for category/topic landing pages so readers can subscribe to a beat
 * (e.g. "Career Advice", "React") without following any one author.
 */
export function TopicFollowButton({
  categorySlug,
  initialFollowing,
  isLoggedIn,
}: {
  categorySlug: string;
  initialFollowing: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?next=/category/${categorySlug}`);
      return;
    }
    if (isPending) return;

    const wasFollowing = following;
    setFollowing(!wasFollowing);

    startTransition(async () => {
      try {
        const body = await apiFetch<{ following: boolean }>(`/categories/${categorySlug}/follow`, {
          method: 'POST',
          revalidate: false,
        });
        setFollowing(body?.following ?? !wasFollowing);
      } catch {
        setFollowing(wasFollowing);
      }
    });
  };

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 transition disabled:opacity-60',
        following
          ? 'bg-ink-50 text-ink-700 ring-ink-200 hover:bg-ink-100'
          : 'bg-slate-950 text-white ring-slate-950 hover:bg-slate-900',
      )}
    >
      {following ? <BellRing size={16} /> : <Bell size={16} />}
      {following ? 'Following topic' : 'Follow topic'}
    </button>
  );
}
