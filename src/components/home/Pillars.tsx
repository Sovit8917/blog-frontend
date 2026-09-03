import Link from "next/link";
import { Briefcase, Compass, Code2, ArrowRight } from "lucide-react";

const PILLARS = [
  {
    href: "/jobs",
    icon: Briefcase,
    title: "Tech Jobs",
    description:
      "Open roles from real engineering teams — filter by remote, stack, and level.",
    cta: "Browse jobs",
  },
  {
    href: "/category/career-growth",
    icon: Compass,
    title: "Career Content",
    description:
      "Interview prep, resume advice, and stories from engineers who have been there.",
    cta: "Read career guides",
  },
  {
    href: "/resources",
    icon: Code2,
    title: "Developer Resources",
    description:
      "Curated developer tools, libraries, tutorials, courses, and documentation.",
    cta: "Browse resources",
  },
];

/**
 * The homepage's positioning statement: three concrete entry points that
 * tell a first-time visitor exactly what this site is for (tech jobs,
 * career growth, dev learning) before they scroll into the article feed.
 */
export function Pillars() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {PILLARS.map(({ href, icon: Icon, title, description, cta }) => (
        <Link
          key={href}
          href={href}
          className="group flex flex-col rounded-2xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 transition hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 transition group-hover:bg-brand-600 dark:group-hover:bg-brand-500 group-hover:text-white">
            <Icon size={19} />
          </div>
          <h3 className="mt-4 text-base font-bold text-ink-900 dark:text-ink-100">
            {title}
          </h3>
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
            {description}
          </p>
          <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
            {cta}{" "}
            <ArrowRight
              size={14}
              className="transition group-hover:translate-x-0.5"
            />
          </span>
        </Link>
      ))}
    </section>
  );
}
