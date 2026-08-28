import { cn } from '@/lib/utils';

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'brand' | 'sponsor' | 'outline';
  className?: string;
}) {
  const styles = {
    default: 'bg-ink-100 text-ink-700',
    brand: 'bg-brand-50 text-brand-700',
    sponsor: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
    outline: 'ring-1 ring-inset ring-ink-200 text-ink-600',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
