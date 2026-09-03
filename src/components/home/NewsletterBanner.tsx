import { NewsletterForm } from "./NewsletterForm";
import { NewsletterSponsorLine } from "./NewsletterSponsorLine";
import { Mail, Sparkles } from "lucide-react";

export function NewsletterBanner() {
  return (
    <section className="relative mt-10 mb-6 overflow-hidden rounded-3xl border border-slate-200/90 dark:border-ink-800 bg-gradient-to-br from-white via-slate-50 to-brand-50/20 dark:from-ink-900 dark:via-ink-900/90 dark:to-brand-950/40 p-6 text-center shadow-sm dark:shadow-lg sm:p-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-200 dark:ring-brand-500/20">
        <Mail size={24} />
      </div>
      <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-ink-50 sm:text-3xl">
        Get the latest tech essays &amp; jobs in your inbox
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-600 dark:text-ink-400">
        Curated once a week. Zero spam, unsubscribe whenever you want.
      </p>
      <div className="mx-auto mt-6 max-w-md">
        <NewsletterForm />
      </div>
      <NewsletterSponsorLine />
    </section>
  );
}
