'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bookmark, Search, Briefcase, Building2, GraduationCap, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { Category } from '@/types';

type NavItem = { href: string; label: string };

const JOB_ICON: Record<string, React.ElementType> = {
  '/jobs': Briefcase,
  '/companies': Building2,
  '/skills': GraduationCap,
};

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
        className="-ml-1.5 rounded-md p-2 text-ink-600 transition hover:bg-ink-50 active:bg-ink-100"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-y-0 left-0 z-[101] flex h-full w-[85vw] max-w-[20rem] flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="text-xl font-bold tracking-tight text-ink-950"
              >
                The<span className="text-brand-600">Blog</span>
              </Link>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-ink-400 hover:bg-slate-100 hover:text-ink-900 active:bg-slate-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-6">
              {/* SearchBar */}
              <Link
                href="/search"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-medium text-ink-600 shadow-sm active:bg-slate-100 transition"
              >
                <Search size={18} className="text-ink-400" />
                <span>Search articles & guides...</span>
              </Link>

              {/* Navigation Destinations */}
              <div>
                <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-ink-400">
                  Quick Access
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {jobBoardNav.map((item) => {
                    const Icon = JOB_ICON[item.href] ?? Briefcase;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                          isActive(item.href)
                            ? 'bg-brand-50 text-brand-700 border border-brand-200/80'
                            : 'bg-slate-50 text-ink-700 border border-slate-200/60 hover:bg-slate-100'
                        }`}
                      >
                        <Icon size={16} className={isActive(item.href) ? 'text-brand-600' : 'text-ink-500'} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* All Categories */}
              {categories.length > 0 && (
                <div>
                  <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-ink-400">
                    Categories
                  </p>
                  <ul className="space-y-1">
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <MobileLink href={`/category/${cat.slug}`} active={isActive(`/category/${cat.slug}`)}>
                          {cat.name}
                        </MobileLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* User Account / Bookmarks */}
              <div>
                <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-ink-400">
                  Account & Saved
                </p>
                <ul className="space-y-1">
                  <li>
                    <MobileLink href="/me/bookmarks" active={isActive('/me/bookmarks')} icon={<Bookmark size={17} />}>
                      Bookmarks
                    </MobileLink>
                  </li>
                  {user && (
                    <>
                      <li>
                        <MobileLink href="/me/applications" active={isActive('/me/applications')}>
                          My Applications
                        </MobileLink>
                      </li>
                      <li>
                        <MobileLink href="/me/saved-jobs" active={isActive('/me/saved-jobs')}>
                          Saved Jobs
                        </MobileLink>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </nav>

            {!user && (
              <div className="border-t border-slate-100 p-5 bg-slate-50/50">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-700 active:bg-brand-800 transition"
                >
                  Sign in to account
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
