import Link from 'next/link';
import { NewsletterForm } from '@/components/home/NewsletterForm';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-ink-50/60">
      <div className="container-page py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="text-lg font-bold text-ink-900">
              The<span className="text-brand-600">Blog</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
              Thoughtful writing on the things worth thinking about. New essays every week —
              straight to your inbox, no noise.
            </p>
            <div className="mt-4 max-w-sm">
              <NewsletterForm compact />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li><Link href="/" className="hover:text-ink-900">Latest</Link></li>
              <li><Link href="/search" className="hover:text-ink-900">Search</Link></li>
              <li><Link href="/jobs" className="hover:text-ink-900">Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Partner</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li><Link href="/advertise" className="hover:text-ink-900">Advertise with us</Link></li>
              <li><Link href="/me/employer-access" className="hover:text-ink-900">Post a job</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink-900">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li><Link href="/about" className="hover:text-ink-900">About</Link></li>
              <li><Link href="/privacy" className="hover:text-ink-900">Privacy</Link></li>
              <li><Link href="/disclosure" className="hover:text-ink-900">Advertising Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-ink-100 pt-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} The Blog. All rights reserved.</p>
          <p>Some posts contain affiliate links; we may earn a commission at no cost to you.</p>
        </div>
      </div>
    </footer>
  );
}
