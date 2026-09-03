import { NewsletterForm } from "./NewsletterForm";
import { NewsletterSponsorLine } from "./NewsletterSponsorLine";
import { Mail, Sparkles } from "lucide-react";

export function NewsletterBanner() {
  return (
    <section className="relative mt-10 mb-6 overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-brand-50/20 p-6 text-center shadow-sm sm:p-8">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
        <Mail size={22} />
      </div>
      <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
        Get the latest tech essays & jobs in your inbox
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
        Curated once a week. Zero spam, unsubscribe whenever you want.
      </p>
      <div className="mx-auto mt-6 max-w-md">
        <NewsletterForm />
      </div>
      <NewsletterSponsorLine />
    </section>
  );
}
