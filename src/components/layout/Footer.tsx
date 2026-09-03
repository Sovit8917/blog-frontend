import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { AdSlot } from "@/components/ads/AdSlot";
import devnexaLogoTransparent from "@/assests/devnexa-logo-transpernet.png";
import { Sparkles, Rss } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-4 bg-transparent text-slate-700">
      {/* Subtle sleek wave shape divider */}
      <div className="w-full overflow-hidden leading-none pointer-events-none -mb-px">
        <svg
          className="relative block w-full h-6 sm:h-9 md:h-11 text-[#eff6ff] fill-current"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C200,45 400,-15 600,22 C800,55 1000,5 1200,20 L1200,60 L0,60 Z" />
        </svg>
      </div>

      <div className="bg-[#eff6ff]">
        <div className="container-page pb-8 pt-1">
          {/* Top Highlight Banner: Follow Us On Social Media */}
          <div className="mb-7 rounded-2xl border border-blue-200/80 bg-white/90 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white shadow-md shadow-brand-500/25">
                <Rss size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                  Follow Us On Social Media
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Stay connected for daily tech jobs, interview prep & updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* LinkedIn */}
              <a
                href={
                  process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL ||
                  "https://linkedin.com"
                }
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0A66C2] text-white shadow-xs transition-all hover:scale-110 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#0A66C2]/30"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25a1.62 1.62 0 0 0-1.63 1.62 1.63 1.63 0 1 0 3.25 0c0-.9-.73-1.62-1.62-1.62Z" />
                </svg>
              </a>

              {/* Telegram */}
              <a
                href={
                  process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM_URL ||
                  "https://telegram.org"
                }
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#229ED9] text-white shadow-xs transition-all hover:scale-110 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#229ED9]/30"
                aria-label="Telegram"
              >
                <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                  <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.67c.458 0 .66-.21.916-.458l2.199-2.138 4.573 3.378c.843.464 1.448.225 1.658-.785l2.997-14.113c.307-1.233-.472-1.792-1.506-1.521z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={
                  process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP_URL ||
                  "https://whatsapp.com"
                }
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-xs transition-all hover:scale-110 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#25D366]/30"
                aria-label="WhatsApp"
              >
                <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29s-1.47-.73-1.7-.81c-.23-.09-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43-.14-.01-.3-.01-.47-.01Z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={
                  process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL ||
                  "https://instagram.com"
                }
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-xs transition-all hover:scale-110 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#E4405F]/30"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={
                  process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL ||
                  "https://facebook.com"
                }
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1877F2] text-white shadow-xs transition-all hover:scale-110 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#1877F2]/30"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-12 items-start">
            {/* Brand & Mission Column */}
            <div className="space-y-3 lg:col-span-4">
              <Link href="/" className="inline-flex items-center py-1">
                <Image
                  src={devnexaLogoTransparent}
                  alt="Devnexa"
                  height={52}
                  className="h-10 sm:h-12 w-auto object-contain origin-left filter drop-shadow-xs contrast-125"
                />
              </Link>
              <p className="text-xs leading-relaxed text-slate-600 max-w-sm font-normal">
                Empowering developers and tech professionals with curated career
                guidance, tech job opportunities, and developer resources.
              </p>
            </div>

            {/* Quick Links Column 1: Explore */}
            <div className="lg:col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Explore
              </h3>
              <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-brand-600 hover:font-medium"
                  >
                    Articles & Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jobs"
                    className="transition-colors hover:text-brand-600 hover:font-medium"
                  >
                    Tech Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/me/resume-ats"
                    className="inline-flex items-center gap-1 transition-colors hover:text-brand-600 font-semibold text-slate-900"
                  >
                    <Sparkles size={11} className="text-brand-600" /> Resume ATS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources"
                    className="transition-colors hover:text-brand-600 hover:font-medium"
                  >
                    Dev Resources
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links Column 2: Partner */}
            <div className="lg:col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Partner
              </h3>
              <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                <li>
                  <Link
                    href="/advertise"
                    className="transition-colors hover:text-brand-600 hover:font-medium"
                  >
                    Advertise with us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/me/employer-access"
                    className="transition-colors hover:text-brand-600 hover:font-medium"
                  >
                    Post a Job Listing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/for-you"
                    className="transition-colors hover:text-brand-600 hover:font-medium"
                  >
                    Personalized Feed
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="space-y-2 lg:col-span-4 sm:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Stay in the loop
              </h3>
              <p className="text-xs text-slate-600">
                Get our weekly digest of tech trends, career opportunities, and
                tools.
              </p>
              <div className="pt-0.5">
                <NewsletterForm compact />
              </div>
            </div>
          </div>

          <AdSlot placement="FOOTER" className="mt-6" />

          {/* Bottom copyright bar */}
          <div className="mt-6 flex flex-col gap-2 border-t border-slate-300/70 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Devnexa. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4 text-slate-600">
              <Link href="/about" className="transition hover:text-slate-900">
                About
              </Link>
              <span>·</span>
              <Link href="/privacy" className="transition hover:text-slate-900">
                Privacy Policy
              </Link>
              <span>·</span>
              <Link
                href="/disclosure"
                className="transition hover:text-slate-900"
              >
                Disclosure
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
