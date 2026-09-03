"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Bookmark,
  Search,
  Briefcase,
  Building2,
  GraduationCap,
  ChevronRight,
  User,
  FileCheck2,
  Sliders,
  Bell,
  FolderHeart,
  BookOpen,
  Award,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import devnexaLogoTransparent from "@/assests/devnexa-logo-transpernet.png";
import type { Category } from "@/types";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = { href: string; label: string };

const JOB_ICON: Record<string, React.ElementType> = {
  "/jobs": Briefcase,
  "/me/resume-ats": FileCheck2,
  "/me/preferences": Sliders,
  "/me/job-alerts": Bell,
  "/me/saved-jobs": FolderHeart,
  "/resources": BookOpen,
  "/career": Award,
  "/companies": Building2,
  "/skills": GraduationCap,
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
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

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
        className="relative z-[10000] flex h-full w-[85vw] max-w-[20rem] flex-col bg-white dark:bg-ink-900 shadow-2xl animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center"
          >
            <Image
              src={devnexaLogoTransparent}
              alt="Devnexa"
              height={44}
              className="h-10.5 w-auto object-contain scale-110 origin-left contrast-125 brightness-95"
              priority
            />
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-ink-500 dark:text-ink-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-ink-950 dark:hover:text-ink-50 active:bg-slate-200 dark:active:bg-slate-700 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-6">
          {/* SearchBar */}
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900 px-4 py-3 text-sm font-medium text-ink-600 dark:text-ink-400 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 active:bg-slate-100 dark:active:bg-slate-800 transition"
          >
            <Search size={18} className="text-ink-400 dark:text-ink-500" />
            <span>Search articles & guides...</span>
          </Link>

          {/* Categories First */}
          {categories.length > 0 && (
            <div>
              <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
                Categories
              </p>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive(`/category/${cat.slug}`)
                          ? "bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-semibold"
                          : "text-ink-800 dark:text-ink-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-ink-950 dark:hover:text-ink-50 active:bg-slate-100 dark:active:bg-slate-800"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronRight size={16} className="text-ink-300 dark:text-ink-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Access / Tools */}
          <div>
            <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
              Quick Access &amp; Tools
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
                        ? "bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 border border-brand-200/80 dark:border-brand-700"
                        : "bg-slate-50 dark:bg-slate-900 text-ink-700 dark:text-ink-300 border border-slate-200/60 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        isActive(item.href) ? "text-brand-600 dark:text-brand-400" : "text-ink-500 dark:text-ink-400"
                      }
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Account & Saved */}
          <div>
            <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
              Account & Saved
            </p>
            <ul className="space-y-1">
              <li>
                <MobileLink
                  href="/me/bookmarks"
                  active={isActive("/me/bookmarks")}
                  icon={<Bookmark size={17} />}
                >
                  Bookmarks
                </MobileLink>
              </li>
              {user && (
                <>
                  <li>
                    <MobileLink
                      href="/me/applications"
                      active={isActive("/me/applications")}
                    >
                      My Applications
                    </MobileLink>
                  </li>
                  <li>
                    <MobileLink
                      href="/me/saved-jobs"
                      active={isActive("/me/saved-jobs")}
                    >
                      Saved Jobs
                    </MobileLink>
                  </li>
                  <li>
                    <MobileLink
                      href="/me/job-alerts"
                      active={isActive("/me/job-alerts")}
                    >
                      Job Alerts
                    </MobileLink>
                  </li>
                  <li>
                    <MobileLink
                      href="/me/preferences"
                      active={isActive("/me/preferences")}
                    >
                      Job Preferences
                    </MobileLink>
                  </li>
                  <li>
                    <MobileLink
                      href="/me/resume"
                      active={isActive("/me/resume")}
                    >
                      My Resume
                    </MobileLink>
                  </li>
                  <li>
                    <MobileLink
                      href="/me/resume-ats"
                      active={isActive("/me/resume-ats")}
                    >
                      Resume ATS Analysis
                    </MobileLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        {/* Footer Action */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900 space-y-3">
          {user ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-bold text-sm">
                  {user.name?.[0] || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900 dark:text-ink-100">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-ink-500 dark:text-ink-400">
                    @{user.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-ink-900 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:border-rose-200 dark:hover:border-rose-800 transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2.5 text-center text-xs font-semibold text-white shadow-sm hover:bg-slate-900 active:bg-black transition"
              >
                <User size={15} />
                <span>Sign in</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-ink-900 px-3 py-2.5 text-center text-xs font-semibold text-ink-800 dark:text-ink-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
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
        className="-ml-1.5 rounded-md p-2 text-ink-600 dark:text-ink-400 transition hover:bg-ink-50 dark:hover:bg-ink-800 active:bg-ink-100 dark:active:bg-ink-800"
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
        active
          ? "bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400"
          : "text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 active:bg-ink-100 dark:active:bg-ink-800"
      }`}
    >
      <span className="flex items-center gap-2.5">
        {icon}
        {children}
      </span>
      <ChevronRight
        size={16}
        className={active ? "text-brand-400" : "text-ink-300 dark:text-ink-600"}
      />
    </Link>
  );
}
