import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';
import { getCollection } from '@/lib/api';
import { getCookieHeader } from '@/lib/auth/session';
import { DeleteCollectionButton } from '@/components/collections/DeleteCollectionButton';
import { RemoveFromCollectionButton } from '@/components/collections/RemoveFromCollectionButton';
import { timeAgo, readingTimeLabel } from '@/lib/utils';
import { buildListMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.id, getCookieHeader()).catch(() => null);
  return buildListMetadata({
    title: collection?.name ?? 'Collection',
    description: collection?.description || 'A saved reading list.',
    path: `/me/collections/${params.id}`,
  });
}

export default async function CollectionDetailPage({ params }: { params: { id: string } }) {
  const collection = await getCollection(params.id, getCookieHeader()).catch(() => null);
  if (!collection) notFound();

  return (
    <div className="container-page py-10">
      <Link
        href="/me/collections"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft size={15} /> All collections
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-ink-900">{collection.name}</h1>
            {collection.isPrivate && <Lock size={16} className="text-ink-400" />}
          </div>
          {collection.description && <p className="mt-2 max-w-xl text-ink-500">{collection.description}</p>}
          <p className="mt-2 text-sm text-ink-400">{collection.items.length} saved</p>
        </div>
        <DeleteCollectionButton collectionId={collection.id} redirectTo="/me/collections" />
      </header>

      {collection.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 py-16 text-center text-ink-400">
          Nothing saved here yet.{' '}
          <Link href="/blog" className="link-underline text-ink-700">
            Browse the blog
          </Link>{' '}
          and add articles to this collection from the post page.
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {collection.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-ink-100 p-4"
            >
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-100">
                {item.post.coverImageUrl ? (
                  <Image
                    src={item.post.coverImageUrl}
                    alt={item.post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-ink-400">{item.post.title[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <Link
                  href={`/blog/${item.post.slug}`}
                  className="font-semibold text-ink-900 hover:text-brand-600"
                >
                  {item.post.title}
                </Link>
                <p className="text-sm text-ink-500">
                  {item.post.author?.name} · {readingTimeLabel(item.post.readingTimeMins)}
                </p>
                <p className="mt-0.5 text-xs text-ink-400">Added {timeAgo(item.addedAt)}</p>
              </div>
              <RemoveFromCollectionButton collectionId={collection.id} postId={item.post.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
