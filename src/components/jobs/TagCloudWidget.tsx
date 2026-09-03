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
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Link
            key={tag.href}
            href={tag.href}
            className="rounded-lg border border-slate-200/80 bg-slate-50/60 px-2.5 py-1 text-xs font-medium text-slate-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 hover:shadow-sm"
          >
            {tag.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
