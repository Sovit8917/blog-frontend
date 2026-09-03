import Link from 'next/link';

/**
 * A plain link that appends/overrides `cursor` on the current query string.
 * No client JS required; clicking re-renders the server component with the
 * next page appended by the caller (see `/jobs`, `/skills/[slug]`).
 */
export function LoadMoreLink({
  basePath,
  params,
  cursor,
}: {
  basePath: string;
  params: Record<string, string | number | undefined>;
  cursor: string;
}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  search.set('cursor', cursor);

  return (
    <div className="mt-8 flex justify-center">
      <Link
        href={`${basePath}?${search.toString()}`}
        className="rounded-lg px-5 py-2.5 text-sm font-medium text-ink-700 dark:text-ink-300 ring-1 ring-ink-200 dark:ring-ink-700 transition hover:bg-ink-50 dark:hover:bg-ink-800"
      >
        Load more
      </Link>
    </div>
  );
}
