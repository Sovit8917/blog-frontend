'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

type NavItem = { href: string; label: string; description?: string };

/**
 * Groups secondary nav items (Companies, Dev Resources, ...) behind a single
 * "Jobs" trigger so the top bar reads as 3–4 choices instead of 6+. Opens on
 * click and hover, closes on outside click / Escape / route change.
 */
export function NavDropdown({ label, href, items }: { label: string; href: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`) || items.some((i) => pathname.startsWith(i.href));

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition ${
          active ? 'text-ink-900' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
        }`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 w-56 rounded-xl border border-ink-100 bg-white p-1.5 shadow-lg animate-fade-in"
        >
          <Link
            href={href}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 hover:bg-ink-50"
          >
            All jobs
          </Link>
          <div className="my-1 h-px bg-ink-100" />
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
