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
    default: "bg-ink-100 text-ink-700",
    brand: "bg-brand-50 text-brand-700 ring-1 ring-brand-200/50",
    sponsor: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    outline:
      "ring-1 ring-inset ring-slate-200 text-slate-600 bg-white/50 hover:bg-slate-50 transition-colors",
    dark: "bg-slate-100/90 text-slate-700 border border-slate-200/70 font-semibold tracking-normal hover:bg-slate-200/80 transition-colors",
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
