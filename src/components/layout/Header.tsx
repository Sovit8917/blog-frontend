import Link from 'next/link';
import { Search, Bookmark } from 'lucide-react';
import { listCategories } from '@/lib/api';
import { MobileNav } from './MobileNav';
import { HeaderAuthActions } from './HeaderAuthActions';
import { NavLink } from './NavLink';

// Single source of truth for primary nav — job-board links live alongside
// content categories instead of being a second, visually-identical group
// bolted on after a divider (that's what caused the "Jobs / Companies /
// Dev Resources" duplication next to "Tech Jobs / Developer Resources").
const JOB_BOARD_NAV = [
  { href: '/jobs', label: 'Jobs' },
  { href: '/companies', label: 'Companies' },
  { href: '/skills', label: 'Dev Resources' },
];

/**
 * Site header: server component so the primary nav (categories) is part of the
 * initial HTML — no client-side fetch/flash for something search engines and
 * first paint both need immediately.
 */
export async function Header() {
  const categories = await listCategories().catch(() => []);
  const topLevel = (Array.isArray(categories) ? categories : [])
    .filter((c) => !c.parentId)
    .slice(0, 4);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container-page flex h-14 items-center justify-between gap-3 sm:h-16">
        <div className="flex min-w-0 items-center gap-6 xl:gap-8">
          <Link href="/" className="shrink-0 text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
            The<span className="text-brand-600">Blog</span>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {topLevel.map((cat) => (
              <NavLink key={cat.id} href={`/category/${cat.slug}`}>
                {cat.name}
              </NavLink>
            ))}
            <span className="mx-2 h-4 w-px bg-ink-200" aria-hidden="true" />
            {JOB_BOARD_NAV.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Link
            href="/search"
            aria-label="Search"
            className="rounded-md p-2 text-ink-500 transition hover:bg-ink-50 hover:text-ink-900"
          >
            <Search size={19} />
          </Link>
          <Link
            href="/me/bookmarks"
            aria-label="Bookmarks"
            className="hidden rounded-md p-2 text-ink-500 transition hover:bg-ink-50 hover:text-ink-900 sm:inline-flex"
          >
            <Bookmark size={19} />
          </Link>
          <HeaderAuthActions />
          <MobileNav categories={topLevel} jobBoardNav={JOB_BOARD_NAV} />
        </div>
      </div>
    </header>
  );
}
