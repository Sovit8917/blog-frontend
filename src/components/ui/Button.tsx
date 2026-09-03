import { cn } from "@/lib/utils";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none";
const variants: Record<Variant, string> = {
  primary: "bg-slate-950 text-white hover:bg-slate-900 shadow-sm",
  secondary: "bg-slate-900 text-white hover:bg-slate-800",
  outline: "ring-1 ring-inset ring-slate-200 text-slate-800 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
};
const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-5 py-3",
};

interface Props extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> {
  variant?: Variant;
  size?: Size;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  target,
  rel,
  onClick,
  children,
  ...rest
}: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    // External (mostly employer apply-links) get a plain <a> so target/rel
    // are guaranteed to apply — Next's <Link> is meant for internal routes.
    if (isExternal || target === "_blank") {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={cls}
          onClick={onClick as any}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} onClick={onClick as any}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} onClick={onClick as any} {...rest}>
      {children}
    </button>
  );
}
