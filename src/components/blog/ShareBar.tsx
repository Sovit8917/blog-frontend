'use client';

// Kept as a thin wrapper so existing `import { ShareBar } from
// '@/components/blog/ShareBar'` call sites keep working — the real
// implementation is the Universal Share component (#9), shared across
// blog posts, jobs, and companies.
import { ShareButton, type ShareButtonProps } from '@/components/shared/ShareButton';

export function ShareBar(props: Omit<ShareButtonProps, 'contentType'> & { postId?: string }) {
  return <ShareButton contentType="post" {...props} />;
}
