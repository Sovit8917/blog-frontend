import Link from 'next/link';

export function OffsetPager({
  basePath,
  params,
  page,
  totalPages,
}: {
  basePath: string;
  params: Record<string, string | number | undefined>;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') search.set(key, String(value));
    }
    search.set('page', String(p));
    return `${basePath}?${search.toString()}`;
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 ring-1 ring-ink-200 dark:ring-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800">
          Previous
        </Link>
      ) : (
        <span className="rounded-lg px-4 py-2 text-sm font-medium text-ink-300 dark:text-ink-600 ring-1 ring-ink-100 dark:ring-ink-800">Previous</span>
      )}
      <span className="text-sm text-ink-500 dark:text-ink-400">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 ring-1 ring-ink-200 dark:ring-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800">
          Next
        </Link>
      ) : (
        <span className="rounded-lg px-4 py-2 text-sm font-medium text-ink-300 dark:text-ink-600 ring-1 ring-ink-100 dark:ring-ink-800">Next</span>
      )}
    </div>
  );
}
