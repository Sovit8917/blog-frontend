import { NewsletterForm } from './NewsletterForm';

export function NewsletterBanner() {
  return (
    <section className="my-16 rounded-2xl bg-ink-900 px-6 py-12 text-center sm:px-12">
      <h2 className="text-2xl font-bold text-white sm:text-3xl">Get new essays in your inbox</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-300">
        One email a week. No spam, unsubscribe anytime.
      </p>
      <div className="mx-auto mt-6 max-w-sm">
        <NewsletterForm />
      </div>
    </section>
  );
}
