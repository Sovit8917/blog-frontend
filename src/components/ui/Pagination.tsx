import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  basePath: string;
  params: Record<string, string | number | boolean | undefined>;
  page: number;
  totalPages: number;
}

export function Pagination({
  basePath,
  params,
  page,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (p: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '' && key !== 'page' && key !== 'cursor') {
        search.set(key, String(value));
      }
    }
    if (p > 1) {
      search.set('page', String(p));
    }
    const queryStr = search.toString();
    return queryStr ? `${basePath}?${queryStr}` : basePath;
  };

  // Generate page numbers to display with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        end = 4;
      } else if (page >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) pages.push('...');

      for (let i = start; i <= end; i++) pages.push(i);

      if (end < totalPages - 1) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className="mt-8 flex items-center justify-between border-t border-ink-100 dark:border-ink-800 pt-6"
    >
      {/* Mobile controls */}
      <div className="flex w-full items-center justify-between sm:hidden">
        {page > 1 ? (
          <Link
            href={createPageUrl(page - 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-ink-900 px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <ChevronLeft size={16} /> Previous
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm font-medium text-ink-300 dark:text-ink-600 cursor-not-allowed">
            <ChevronLeft size={16} /> Previous
          </span>
        )}

        <span className="text-xs text-ink-500 dark:text-ink-400 font-medium">
          Page {page} of {totalPages}
        </span>

        {page < totalPages ? (
          <Link
            href={createPageUrl(page + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-ink-900 px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Next <ChevronRight size={16} />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm font-medium text-ink-300 dark:text-ink-600 cursor-not-allowed">
            Next <ChevronRight size={16} />
          </span>
        )}
      </div>

      {/* Desktop controls */}
      <div className="hidden sm:flex sm:w-full sm:items-center sm:justify-between">
        <div className="text-sm text-ink-500 dark:text-ink-400">
          Page <span className="font-semibold text-ink-800 dark:text-ink-200">{page}</span> of{' '}
          <span className="font-semibold text-ink-800 dark:text-ink-200">{totalPages}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          {page > 1 ? (
            <Link
              href={createPageUrl(page - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-ink-900 px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition shadow-xs"
              aria-label="Go to previous page"
            >
              <ChevronLeft size={16} /> Previous
            </Link>
          ) : (
            <span
              className="inline-flex items-center gap-1 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm font-medium text-ink-300 dark:text-ink-600 cursor-not-allowed"
              aria-disabled="true"
            >
              <ChevronLeft size={16} /> Previous
            </span>
          )}

          {/* Page numbers */}
          <div className="flex items-center gap-1 px-1">
            {pageNumbers.map((num, i) => {
              if (num === '...') {
                return (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-2 py-1.5 text-sm text-ink-400 dark:text-ink-500 font-medium"
                  >
                    …
                  </span>
                );
              }

              const isCurrent = num === page;
              return isCurrent ? (
                <span
                  key={num}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-950 text-sm font-semibold text-white shadow-xs"
                  aria-current="page"
                >
                  {num}
                </span>
              ) : (
                <Link
                  key={num}
                  href={createPageUrl(num as number)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-ink-900 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition"
                  aria-label={`Go to page ${num}`}
                >
                  {num}
                </Link>
              );
            })}
          </div>

          {/* Next Button */}
          {page < totalPages ? (
            <Link
              href={createPageUrl(page + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-ink-900 px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition shadow-xs"
              aria-label="Go to next page"
            >
              Next <ChevronRight size={16} />
            </Link>
          ) : (
            <span
              className="inline-flex items-center gap-1 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm font-medium text-ink-300 dark:text-ink-600 cursor-not-allowed"
              aria-disabled="true"
            >
              Next <ChevronRight size={16} />
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
