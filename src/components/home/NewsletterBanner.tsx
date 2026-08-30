import { NewsletterForm } from './NewsletterForm';
import { NewsletterSponsorLine } from './NewsletterSponsorLine';

export function NewsletterBanner() {
  return (
    <section className="my-16 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-6 py-10 text-center sm:px-12">
      <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
        Get new essays in your inbox
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-600">
        One email a week. No spam, unsubscribe anytime.
      </p>
      <div className="mx-auto mt-6 max-w-md">
        <NewsletterForm />
      </div>
      <NewsletterSponsorLine />
    </section>
  );
}
