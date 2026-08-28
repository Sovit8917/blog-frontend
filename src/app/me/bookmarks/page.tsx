import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { listMyBookmarks } from '@/lib/api';
import { getCookieHeader } from '@/lib/auth/session';
import { timeAgo } from '@/lib/utils';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'Bookmarks',
  description: 'Posts you have bookmarked to read later.',
  path: '/me/bookmarks',
});

export default async function BookmarksPage() {
  const bookmarks = await listMyBookmarks(getCookieHeader()).catch(() => []);

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900">Bookmarks</h1>
        <p className="mt-2 text-ink-500">Posts you&apos;ve bookmarked to read later.</p>
      </header>

      {bookmarks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 py-16 text-center text-ink-400">
          You haven&apos;t bookmarked any posts yet.{' '}
          <Link href="/blog" className="link-underline text-ink-700">
            Browse the blog
          </Link>
          .
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {bookmarks.map((b) => (
            <li key={b.id} className="flex items-center gap-4 rounded-xl border border-ink-100 p-4">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-100">
                {b.post.coverImageUrl ? (
                  <Image src={b.post.coverImageUrl} alt={b.post.title} fill className="object-cover" />
                ) : (
                  <span className="text-sm font-bold text-ink-400">{b.post.title[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <Link href={`/blog/${b.post.slug}`} className="font-semibold text-ink-900 hover:text-brand-600">
                  {b.post.title}
                </Link>
                <p className="text-sm text-ink-500">{b.post.author?.name}</p>
                <p className="mt-0.5 text-xs text-ink-400">Bookmarked {timeAgo(b.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
