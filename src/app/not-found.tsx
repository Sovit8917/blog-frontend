import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-ink-900">We couldn&apos;t find that page</h1>
      <p className="mt-2 max-w-sm text-ink-500">It may have been moved or no longer exists.</p>
      <Button href="/" className="mt-6">Back to homepage</Button>
    </div>
  );
}
