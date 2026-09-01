import Link from 'next/link';

/**
 * "Tag Cloud"-style widget: a wrap of clickable pill tags. Pass whichever
 * tags/skills are worth surfacing (e.g. the top tags across current jobs) —
 * kept intentionally dumb/presentational so callers control the source.
 */
export function TagCloudWidget({ tags }: { tags: { label: string; href: string }[] }) {
  if (tags.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-brand-600">Tag Cloud</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.href}
            href={tag.href}
            className="rounded-full border border-ink-200 px-3 py-1 text-xs font-medium text-ink-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            {tag.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
