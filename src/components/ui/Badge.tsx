import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "brand" | "sponsor" | "outline" | "dark";
  className?: string;
}) {
  const styles = {
    default: "bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300",
    brand: "bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 ring-1 ring-brand-200/50 dark:ring-brand-800",
    sponsor: "bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800",
    outline:
      "ring-1 ring-inset ring-slate-200 dark:ring-slate-700 text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-ink-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
    dark: "bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 font-semibold tracking-normal hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
