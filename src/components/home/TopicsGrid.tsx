import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

/**
 * "Follow a topic" step of the retention loop: turns a one-off read into a
 * standing reason to come back by making category pages (which double as
 * an implicit topic feed) easy to find right on the homepage, not just
 * buried in nav.
 */
export function TopicsGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Follow your interests</h2>
          <p className="mt-1 text-sm text-ink-500">Pick a topic to see more of what you like, every time you're back.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.slice(0, 12).map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group flex items-center justify-between gap-2 rounded-xl border border-ink-100 bg-white px-4 py-3.5 text-sm font-semibold text-ink-700 transition hover:border-brand-200 hover:bg-brand-50/40 hover:text-brand-700"
          >
            <span className="truncate">{cat.name}</span>
            <ArrowRight size={14} className="shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
          </Link>
        ))}
      </div>
    </section>
  );
}
