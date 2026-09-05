import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  Briefcase,
  Megaphone,
  Link2,
  Mail,
  LineChart,
  Search,
  Gauge,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Zap,
  Rocket,
  Building2,
} from "lucide-react";
import { buildListMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildListMetadata({
  title: "Advertise & Partner With Us",
  description:
    "Reach engaged developers and tech hiring teams. Featured jobs, sponsored content, newsletter placements, and affiliate partnerships — backed by real analytics.",
  path: "/advertise",
});

const PRIMARY = [
  {
    icon: Briefcase,
    title: "Featured Jobs",
    desc:
      "Put your open roles at the top of search and category pages, with a highlighted card in our jobs feed and homepage rail.",
    points: ["Priority placement in job search", "Homepage & category visibility", "Highlighted card styling"],
  },
  {
    icon: BarChart3,
    title: "Employer Analytics",
    desc:
      "See exactly how your listings perform — views, applies, and candidate quality signals — in a live employer dashboard.",
    points: ["Views & apply-through rate", "Funnel breakdown per role", "Exportable weekly reports"],
  },
  {
    icon: Megaphone,
    title: "Sponsored Content",
    desc:
      "Publish branded articles and guides to our developer audience, clearly disclosed and matched to editorial quality bars.",
    points: ["Native placement in the feed", "Written or reviewed with our editors", "Disclosed, trust-safe format"],
  },
  {
    icon: Link2,
    title: "Affiliate Partnerships",
    desc:
      "Get your product in front of readers actively researching tools, courses, and services — tracked and attributed end to end.",
    points: ["Trackable affiliate links", "Click & conversion reporting", "Contextual product placements"],
  },
  {
    icon: Mail,
    title: "Newsletter Sponsorship",
    desc:
      "One dedicated slot per issue, in front of subscribers who opted in for career and industry content.",
    points: ["Single sponsor per issue", "Open & click reporting", "Flexible weekly booking"],
  },
  {
    icon: LineChart,
    title: "Advanced Analytics",
    desc:
      "Every placement — ad, sponsor, job, or newsletter slot — is measured the same way, so you can compare ROI across channels.",
    points: ["Cross-channel dashboards", "Impression & click tracking", "Attribution you can trust"],
  },
];

const PACKAGES = [
  {
    icon: Zap,
    name: "Starter",
    price: "$299",
    period: "/mo",
    desc: "Test the water with a single always-on placement.",
    features: [
      "1 display ad placement (your choice of slot)",
      "Bronze sponsor logo listing",
      "Monthly performance summary",
    ],
    cta: "Start with Starter",
    highlighted: false,
  },
  {
    icon: Rocket,
    name: "Growth",
    price: "$899",
    period: "/mo",
    desc: "The most popular mix for teams hiring and building awareness.",
    features: [
      "3 display ad placements across the site",
      "Gold sponsor card on the homepage",
      "1 sponsored article per quarter",
      "2 featured job listings",
      "Live analytics dashboard access",
    ],
    cta: "Go with Growth",
    highlighted: true,
  },
  {
    icon: Building2,
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Full-funnel presence for teams running always-on campaigns.",
    features: [
      "Unlimited display placements",
      "Platinum sponsor card + homepage strip",
      "Dedicated newsletter sponsor slot",
      "Unlimited featured job listings",
      "Custom affiliate & attribution setup",
      "Dedicated partnerships contact",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

const TRUST = [
  {
    icon: Search,
    title: "SEO at scale",
    desc: "Structured data, sitemaps, and canonical tagging across thousands of pages keep organic reach compounding.",
  },
  {
    icon: Gauge,
    title: "Built for speed",
    desc: "Server-rendered pages and optimized media mean your placement loads fast — and actually gets seen.",
  },
  {
    icon: ShieldCheck,
    title: "Security hardened",
    desc: "Audited auth, rate limiting, and audit logging protect your brand and your data on every campaign.",
  },
];

export default function AdvertisePage() {
  return (
    <>
      <div className="border-b border-ink-100 dark:border-ink-800 bg-gradient-to-b from-brand-50/60 dark:from-brand-900/40 to-white">
        <div className="container-page py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Advertise &amp; Partner
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight text-ink-900 dark:text-ink-100 sm:text-4xl lg:text-[2.75rem]">
            Reach developers and hiring teams who actually read.
          </h1>
          <p className="mt-4 max-w-xl text-ink-500 dark:text-ink-400">
            From featured job listings to sponsored content and newsletter placements — every
            partnership comes with real analytics, fast pages, and a security-hardened platform
            your brand can trust.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/me/employer-access"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
            >
              Become an employer <ArrowRight size={15} />
            </Link>
            <a
              href="mailto:partnerships@karyvio.com"
              className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-ink-900 px-5 py-2.5 text-sm font-semibold text-ink-700 dark:text-ink-300 ring-1 ring-inset ring-ink-200 dark:ring-ink-700 transition hover:bg-ink-50 dark:hover:bg-ink-800"
            >
              Talk to our partnerships team
            </a>
          </div>
        </div>
      </div>

      <div className="container-page py-14 sm:py-16">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-xl font-bold text-ink-900 dark:text-ink-100 sm:text-2xl">
            Every way to put your brand in front of our audience
          </h2>
          <p className="mt-2 text-ink-500 dark:text-ink-400">
            Pick one channel or combine several — every placement is measured the same way, so
            you always know what's working.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRIMARY.map(({ icon: Icon, title, desc, points }) => (
            <div
              key={title}
              className="group flex flex-col rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 transition group-hover:bg-brand-600 dark:group-hover:bg-brand-500 group-hover:text-white">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 text-base font-bold text-ink-900 dark:text-ink-100">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{desc}</p>
              <ul className="mt-4 space-y-1.5">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-400">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-500 dark:text-brand-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-y border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-900">
        <div className="container-page py-14 sm:py-16">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-xl font-bold text-ink-900 dark:text-ink-100 sm:text-2xl">Advertiser packages</h2>
            <p className="mt-2 text-ink-500 dark:text-ink-400">
              Straightforward monthly tiers, or a custom mix for larger campaigns — either way you
              get the same real-time analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PACKAGES.map(({ icon: Icon, name, price, period, desc, features, cta, highlighted }) => (
              <div
                key={name}
                className={`relative flex flex-col rounded-2xl p-6 shadow-sm transition sm:p-7 ${
                  highlighted
                    ? "border-2 border-brand-500 bg-white dark:bg-ink-900 ring-1 ring-brand-500/20 sm:-translate-y-2"
                    : "border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                {highlighted && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand-600 dark:bg-brand-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Most popular
                  </span>
                )}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    highlighted ? "bg-brand-600 dark:bg-brand-500 text-white" : "bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink-900 dark:text-ink-100">{name}</h3>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-ink-900 dark:text-ink-100">{price}</span>
                  {period && <span className="text-sm font-medium text-ink-400 dark:text-ink-500">{period}</span>}
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-400">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-brand-500 dark:text-brand-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:partnerships@karyvio.com"
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
                    highlighted
                      ? "bg-brand-600 dark:bg-brand-500 text-white hover:bg-brand-700 dark:hover:bg-brand-600"
                      : "bg-slate-950 text-white hover:bg-slate-900"
                  }`}
                >
                  {cta} <ArrowRight size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900">
        <div className="container-page py-14">
          <h2 className="text-xl font-bold text-ink-900 dark:text-ink-100 sm:text-2xl">
            The platform behind every placement
          </h2>
          <p className="mt-2 max-w-xl text-ink-500 dark:text-ink-400">
            Performance and trust aren't add-ons — they're built into the site your campaign runs on.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TRUST.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-white dark:bg-ink-900 p-6 ring-1 ring-ink-100 dark:ring-ink-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10 dark:bg-brand-500 text-brand-600 dark:text-brand-400">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-sm font-bold text-ink-900 dark:text-ink-100">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-14 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-gradient-to-br from-brand-600 dark:from-brand-700 to-brand-700 dark:to-brand-800 p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Ready to reach our audience?</h2>
            <p className="mt-2 max-w-md text-sm text-brand-50">
              Tell us your goals — hiring, awareness, or leads — and we'll recommend the right mix
              of placements.
            </p>
          </div>
          <a
            href="mailto:partnerships@karyvio.com"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white dark:bg-ink-900 px-5 py-2.5 text-sm font-semibold text-brand-700 dark:text-brand-400 shadow-sm transition hover:bg-brand-50 dark:hover:bg-brand-900/40"
          >
            Get in touch <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </>
  );
}
