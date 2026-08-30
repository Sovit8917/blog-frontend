import Link from 'next/link';
import { Search, Bookmark } from 'lucide-react';
import { listCategories } from '@/lib/api';
import { MobileNav } from './MobileNav';
import { HeaderAuthActions } from './HeaderAuthActions';
import { NavLink } from './NavLink';
import { NavDropdown } from './NavDropdown';

// Kept deliberately short: only the categories + a single "Jobs" entry point
// live in the visible bar. Companies / Skills / Dev Resources are one click
// away in the "Jobs" dropdown instead of sitting in the bar as separate
// items — fewer top-level choices is easier to scan than a wall of 6+ links.
const JOB_BOARD_NAV = [
  { href: '/jobs', label: 'Jobs' },
  { href: '/companies', label: 'Companies' },
  { href: '/skills', label: 'Skills' },
  { href: '/resources', label: 'Dev Resources' },
  { href: '/career', label: 'Career Content' },
];

/**
 * Site header: server component so the primary nav (categories) is part of the
 * initial HTML — no client-side fetch/flash for something search engines and
 * first paint both need immediately.
 */
export async function Header() {
  const categories = await listCategories().catch(() => []);
  const allTopLevel = (Array.isArray(categories) ? categories : []).filter((c) => !c.parentId);
  const visibleCategories = allTopLevel.slice(0, 3);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container-page flex h-14 items-center justify-between gap-2 sm:h-16">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4 xl:gap-6">
          <MobileNav categories={allTopLevel} jobBoardNav={JOB_BOARD_NAV} />
          <Link href="/" className="shrink-0 text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
            The<span className="text-brand-600">Blog</span>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {visibleCategories.map((cat) => (
              <NavLink key={cat.id} href={`/category/${cat.slug}`}>
                {cat.name}
              </NavLink>
            ))}
            <NavDropdown label="Jobs" href="/jobs" items={JOB_BOARD_NAV.slice(1)} />
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
        </div>
      </div>
    </header>
  );
}
