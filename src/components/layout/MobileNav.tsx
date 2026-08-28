'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bookmark, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { Category } from '@/types';

type NavItem = { href: string; label: string };

export function MobileNav({
  categories,
  jobBoardNav,
}: {
  categories: Category[];
  jobBoardNav: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Close the drawer whenever navigation actually happens, and lock body
  // scroll while it's open so the page behind it doesn't scroll too.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="lg:hidden">
      <button
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="-mr-1 rounded-md p-2 text-ink-600 transition hover:bg-ink-50 active:bg-ink-100"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 animate-fade-in bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl animate-slide-up"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3.5">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="text-lg font-bold tracking-tight text-ink-900"
              >
                The<span className="text-brand-600">Blog</span>
              </Link>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-ink-500 hover:bg-ink-50 active:bg-ink-100"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
              <Link
                href="/search"
                onClick={() => setOpen(false)}
                className="mb-4 flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50/70 px-4 py-3 text-sm font-medium text-ink-600"
              >
                <Search size={17} />
                Search the site
              </Link>

              {categories.length > 0 && (
                <>
                  <p className="px-2 pb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    Explore
                  </p>
                  <ul>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <MobileLink href={`/category/${cat.slug}`} active={isActive(`/category/${cat.slug}`)}>
                          {cat.name}
                        </MobileLink>
                      </li>
                    ))}
                  </ul>
                  <div className="my-3 h-px bg-ink-100" />
                </>
              )}

              <p className="px-2 pb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Job board
              </p>
              <ul>
                {jobBoardNav.map((item) => (
                  <li key={item.href}>
                    <MobileLink href={item.href} active={isActive(item.href)}>
                      {item.label}
                    </MobileLink>
                  </li>
                ))}
              </ul>

              <div className="my-3 h-px bg-ink-100" />

              <ul>
                <li>
                  <MobileLink href="/me/bookmarks" active={isActive('/me/bookmarks')} icon={<Bookmark size={17} />}>
                    Bookmarks
                  </MobileLink>
                </li>
                {user && (
                  <>
                    <li>
                      <MobileLink href="/me/applications" active={isActive('/me/applications')}>
                        My applications
                      </MobileLink>
                    </li>
                    <li>
                      <MobileLink href="/me/saved-jobs" active={isActive('/me/saved-jobs')}>
                        Saved jobs
                      </MobileLink>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            {!user && (
              <div className="border-t border-ink-100 p-4">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-ink-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-ink-800"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileLink({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-2 rounded-lg px-3 py-3 text-[15px] font-medium transition ${
        active ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50 active:bg-ink-100'
      }`}
    >
      <span className="flex items-center gap-2.5">
        {icon}
        {children}
      </span>
      <ChevronRight size={16} className={active ? 'text-brand-400' : 'text-ink-300'} />
    </Link>
  );
}
