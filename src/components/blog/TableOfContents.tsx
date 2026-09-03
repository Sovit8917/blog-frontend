"use client";

import { useEffect, useState } from "react";

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

  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-ink-900 p-5 shadow-sm"
    >
      <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
        On this page
      </p>
      <ul className="space-y-1 text-xs">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: h.level === 3 ? "0.75rem" : "0rem" }}
          >
            <a
              href={`#${h.id}`}
              className={`block rounded-lg px-2.5 py-1.5 transition leading-snug ${
                activeId === h.id
                  ? "bg-brand-50 dark:bg-brand-900/40 font-semibold text-brand-700 dark:text-brand-400"
                  : "text-ink-500 dark:text-ink-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-ink-900 dark:hover:text-ink-100"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
