"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

type NavItem = { href: string; label: string; description?: string };

/**
 * Groups secondary nav items (Categories first, Job Tools, Dev Resources) behind a single
 * "More" trigger. Opens on click and hover, closes on outside click / Escape / route change.
 */
export function NavDropdown({
  label,
  href = "#",
  items,
  categories,
  tools,
  resources,
}: {
  label: string;
  href?: string;
  items?: NavItem[];
  categories?: NavItem[];
  tools?: NavItem[];
  resources?: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const allItems = [
    ...(categories ?? []),
    ...(tools ?? []),
    ...(resources ?? []),
    ...(items ?? []),
  ];

  const active =
    (href !== "#" && (pathname === href || pathname.startsWith(`${href}/`))) ||
    allItems.some((i) => pathname.startsWith(i.href));

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition ${
          active
            ? "text-ink-900 dark:text-ink-100"
            : "text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-100"
        }`}
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 w-64 max-h-[80vh] overflow-y-auto rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-2 shadow-xl ring-1 ring-black/5 animate-fade-in"
        >
          {href !== "#" && (
            <>
              <Link
                href={href}
                className="block rounded-xl px-3 py-2 text-sm font-semibold text-ink-900 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-800"
              >
                All jobs
              </Link>
              <div className="my-1.5 h-px bg-ink-100 dark:bg-ink-800" />
            </>
          )}

          {/* 1. CATEGORIES FIRST */}
          {categories && categories.length > 0 && (
            <div className="mb-2">
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
                Categories
              </p>
              <div className="space-y-0.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="flex items-center justify-between rounded-xl px-3 py-1.5 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-brand-600 dark:hover:text-brand-400 transition"
                  >
                    <span>{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 2. RESOURCES & EXPLORE */}
          {resources && resources.length > 0 && (
            <div className="mb-2 border-t border-ink-100/80 dark:border-ink-800 pt-2">
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
                Explore
              </p>
              <div className="space-y-0.5">
                {resources.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-xl px-3 py-1.5 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-brand-600 dark:hover:text-brand-400 transition"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 3. CAREER & JOB TOOLS */}
          {tools && tools.length > 0 && (
            <div className="border-t border-ink-100/80 dark:border-ink-800 pt-2">
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
                Job Tools
              </p>
              <div className="space-y-0.5">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center justify-between rounded-xl px-3 py-1.5 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-brand-600 dark:hover:text-brand-400 transition"
                  >
                    <span>{tool.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Fallback items if provided directly */}
          {items && items.length > 0 && !categories && !tools && !resources && (
            <div className="space-y-0.5">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-brand-600 dark:hover:text-brand-400 transition"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
