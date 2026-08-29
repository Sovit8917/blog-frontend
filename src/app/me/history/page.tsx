import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { listReadingHistory } from '@/lib/api';
import { getCookieHeader } from '@/lib/auth/session';
import { timeAgo } from '@/lib/utils';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'Reading History',
  description: 'Articles you have read, most recent first.',
  path: '/me/history',
});

export default async function ReadingHistoryPage() {
  const history = await listReadingHistory(50, getCookieHeader()).catch(() => []);

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900">Reading History</h1>
        <p className="mt-2 text-ink-500">Articles you&apos;ve read, most recent first.</p>
      </header>

      {history.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 py-16 text-center text-ink-400">
          No reading history yet.{' '}
          <Link href="/blog" className="link-underline text-ink-700">
            Browse the blog
          </Link>
          .
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {history.map((h) => (
            <li key={h.id} className="flex items-center gap-4 rounded-xl border border-ink-100 p-4">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-100">
                {h.post.coverImageUrl ? (
                  <Image src={h.post.coverImageUrl} alt={h.post.title} fill className="object-cover" />
                ) : (
                  <span className="text-sm font-bold text-ink-400">{h.post.title[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <Link href={`/blog/${h.post.slug}`} className="font-semibold text-ink-900 hover:text-brand-600">
                  {h.post.title}
                </Link>
                <p className="text-sm text-ink-500">{h.post.author?.name}</p>
                <p className="mt-0.5 text-xs text-ink-400">
                  Read {timeAgo(h.readAt)} · {h.progressPct}% through
                </p>
              </div>
              <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${Math.min(100, h.progressPct)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
