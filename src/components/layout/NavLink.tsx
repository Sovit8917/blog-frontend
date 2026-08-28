'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function NavLink({
  href,
  children,
  className = '',
  exact = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`relative rounded-md px-3 py-2 text-sm font-medium transition ${
        active ? 'text-ink-900' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
      } ${className}`}
    >
      {children}
      {active && (
        <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-brand-600" aria-hidden="true" />
      )}
    </Link>
  );
}
