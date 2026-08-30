'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bookmark, Search, Briefcase, Building2, GraduationCap, ChevronRight, User } from 'lucide-react';
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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const modalContent = open ? (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setOpen(false)}
      />

      {/* Drawer Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="relative z-[10000] flex h-full w-[85vw] max-w-[20rem] flex-col bg-white shadow-2xl animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-xl font-extrabold tracking-tight text-ink-950"
          >
            The<span className="text-brand-600">Blog</span>
          </Link>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-ink-500 hover:bg-slate-100 hover:text-ink-950 active:bg-slate-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-6">
          {/* SearchBar */}
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm font-medium text-ink-600 shadow-sm hover:border-slate-300 active:bg-slate-100 transition"
          >
            <Search size={18} className="text-ink-400" />
            <span>Search articles & guides...</span>
          </Link>

          {/* Quick Access */}
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

          {/* Categories */}
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

          {/* Account & Saved */}
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
                  <li>
                    <MobileLink href="/me/job-alerts" active={isActive('/me/job-alerts')}>
                      Job Alerts
                    </MobileLink>
                  </li>
                  <li>
                    <MobileLink href="/me/resume" active={isActive('/me/resume')}>
                      My Resume
                    </MobileLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        {/* Footer Action */}
        <div className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-3">
          {user ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-sm">
                  {user.name?.[0] || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                  <p className="truncate text-xs text-ink-500">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2.5 text-center text-xs font-semibold text-white shadow-sm hover:bg-brand-700 active:bg-brand-800 transition"
              >
                <User size={15} />
                <span>Sign in</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-center text-xs font-semibold text-ink-800 shadow-sm hover:bg-slate-50 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;

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

      {mounted && modalContent && createPortal(modalContent, document.body)}
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
