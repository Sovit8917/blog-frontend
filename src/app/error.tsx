'use client';

import { Button } from '@/components/ui/Button';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-ink-900">Something went wrong</h1>
      <p className="mt-2 text-ink-500">We hit a snag loading this page. Please try again.</p>
      <Button onClick={reset} className="mt-6">Try again</Button>
    </div>
  );
}
