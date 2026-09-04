"use client";

import { useEffect, useRef, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Client-built ToC: scans rendered <h2>/<h3> elements after mount (they carry
 * ids from rehype-slug) rather than re-parsing markdown, so it always matches
 * what's actually on the page.
 */
export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll(".prose h2, .prose h3"),
    ) as HTMLElement[];
    setHeadings(
      els.map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      })),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-scroll the active heading item into view inside the TOC container
  useEffect(() => {
    if (activeId && activeLinkRef.current && navRef.current) {
      activeLinkRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeId]);

  if (headings.length < 3) return null;

  return (
    <nav
      ref={navRef}
      aria-label="Table of contents"
      className="max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-ink-900 p-5 shadow-sm"
    >
      <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
        On this page
      </p>
      <ul className="space-y-1 text-xs">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          const isH2 = h.level === 2;

          return (
            <li
              key={h.id}
              style={{ paddingLeft: isH2 ? "0rem" : "0.85rem" }}
            >
              <a
                ref={isActive ? activeLinkRef : undefined}
                href={`#${h.id}`}
                className={`block rounded-lg px-2.5 py-1.5 transition leading-snug ${
                  isActive
                    ? "bg-brand-50 dark:bg-brand-950/60 font-bold text-brand-700 dark:text-brand-300"
                    : isH2
                    ? "font-semibold text-ink-900 dark:text-ink-100 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-brand-600 dark:hover:text-brand-400"
                    : "font-medium text-ink-700 dark:text-ink-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-brand-600 dark:hover:text-brand-400"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
