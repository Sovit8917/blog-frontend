'use client';

import { useEffect, useRef, useState } from 'react';
import { logRead } from '@/lib/api/reading-history';

/**
 * Thin progress bar fixed to the top of the viewport, tracking article scroll
 * depth. When `postId` + `isLoggedIn` are given, also feeds "Reading History":
 * debounced so it doesn't fire on every scroll tick, and only sends when the
 * max depth reached actually increased since the last send.
 */
export function ReadingProgress({
  postId,
  isLoggedIn = false,
}: {
  postId?: string;
  isLoggedIn?: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const maxProgressRef = useRef(0);
  const lastSentRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      setProgress(pct);
      maxProgressRef.current = Math.max(maxProgressRef.current, pct);

      if (!postId || !isLoggedIn) return;
      // Debounce: only log once scrolling has paused for a moment, and only
      // if the recorded depth actually moved forward meaningfully (5%+).
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const current = Math.round(maxProgressRef.current);
        if (current - lastSentRef.current >= 5) {
          lastSentRef.current = current;
          logRead(postId, current).catch(() => undefined);
        }
      }, 2500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      // Best-effort final flush so a quick read still gets recorded.
      if (postId && isLoggedIn && Math.round(maxProgressRef.current) > lastSentRef.current) {
        logRead(postId, Math.round(maxProgressRef.current)).catch(() => undefined);
      }
    };
  }, [postId, isLoggedIn]);

  return <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden />;
}
