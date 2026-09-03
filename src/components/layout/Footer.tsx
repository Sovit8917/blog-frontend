import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { AdSlot } from "@/components/ads/AdSlot";
import devnexaLogoTransparent from "@/assests/devnexa-logo-transpernet.png";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/80 bg-slate-50/70">
      <div className="container-page py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5">
            <Link href="/" className="shrink-0 inline-flex items-center">
              <Image
                src={devnexaLogoTransparent}
                alt="Devnexa"
                height={48}
                className="h-10 w-auto object-contain scale-[1.18] origin-left contrast-125 brightness-95"
              />
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              Thoughtful writing on tech, career guidance, and developer resources — straight to your inbox.
            </p>
            <div className="mt-3.5 max-w-sm">
              <NewsletterForm compact />
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/" className="transition hover:text-slate-950">
                  Latest
                </Link>
              </li>
              <li>
                <Link href="/search" className="transition hover:text-slate-950">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="transition hover:text-slate-950">
                  Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Partner</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/advertise" className="transition hover:text-slate-950">
                  Advertise with us
                </Link>
              </li>
              <li>
                <Link href="/me/employer-access" className="transition hover:text-slate-950">
                  Post a job
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/about" className="transition hover:text-slate-950">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-slate-950">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/disclosure" className="transition hover:text-slate-950">
                  Advertising Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <AdSlot placement="FOOTER" className="mt-8" />

        {/* Bottom copyright bar */}
        <div className="mt-8 flex flex-col gap-2 border-t border-slate-200/80 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Devnexa. All rights reserved.</p>
          <p>
            Some posts contain affiliate links; we may earn a commission at no cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
