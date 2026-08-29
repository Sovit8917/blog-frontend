import type { Metadata } from 'next';
import Link from 'next/link';
import { FolderHeart, Lock, ArrowRight } from 'lucide-react';
import { listMyCollections } from '@/lib/api';
import { getCookieHeader } from '@/lib/auth/session';
import { CreateCollectionForm } from '@/components/collections/CreateCollectionForm';
import { buildListMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildListMetadata({
  title: 'My Collections',
  description: 'Group saved articles into reading lists you can revisit anytime.',
  path: '/me/collections',
});

export default async function CollectionsPage() {
  const collections = await listMyCollections(getCookieHeader()).catch(() => []);

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink-900">Collections</h1>
          <p className="mt-2 text-ink-500">
            Group articles into reading lists — interview prep, weekend reads, whatever helps.
          </p>
        </div>
        <CreateCollectionForm />
      </header>

      {collections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 py-16 text-center text-ink-400">
          You haven&apos;t created any collections yet. Start one from any article, or use the
          button above.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/me/collections/${c.id}`}
              className="group flex flex-col rounded-2xl border border-ink-100 bg-white p-5 transition hover:border-brand-200 hover:shadow-sm"
            >
              <div className="flex items-center gap-2 text-brand-600">
                <FolderHeart size={17} />
                {c.isPrivate && <Lock size={13} className="text-ink-400" />}
              </div>
              <h3 className="mt-3 line-clamp-1 text-base font-bold text-ink-900 group-hover:text-brand-600">
                {c.name}
              </h3>
              {c.description && (
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-ink-500">{c.description}</p>
              )}
              <div className="mt-4 flex items-center justify-between text-xs font-medium text-ink-400">
                <span>{c._count?.items ?? 0} saved</span>
                <span className="flex items-center gap-1 text-brand-600 opacity-0 transition group-hover:opacity-100">
                  Open <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
