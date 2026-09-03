import Image from "next/image";
import Link from "next/link";
import { Search, Bookmark } from "lucide-react";
import { listCategories } from "@/lib/api";
import devnexaLogoTransparent from "@/assests/devnexa-logo-transpernet.png";
import { MobileNav } from "./MobileNav";
import { HeaderAuthActions } from "./HeaderAuthActions";
import { NavLink } from "./NavLink";
import { NavDropdown } from "./NavDropdown";
import { ThemeToggle } from "./ThemeToggle";

// Kept deliberately short: only the categories + a single "Jobs" entry point
// live in the visible bar. Companies / Skills / Dev Resources are one click
// away in the "Jobs" dropdown instead of sitting in the bar as separate
// items — fewer top-level choices is easier to scan than a wall of 6+ links.
const JOB_BOARD_NAV = [
  { href: "/jobs", label: "Jobs" },
  { href: "/resources", label: "All Resources" },
  { href: "/career", label: "Career Content" },
  { href: "/companies", label: "Companies" },
  { href: "/skills", label: "Skills" },
  { href: "/me/resume-ats", label: "Resume ATS Analysis" },
  { href: "/me/preferences", label: "Job Preferences" },
  { href: "/me/job-alerts", label: "Job Alerts" },
  { href: "/me/saved-jobs", label: "Saved Jobs" },
];

/**
 * Site header: server component so the primary nav (categories) is part of the
 * initial HTML — no client-side fetch/flash for something search engines and
 * first paint both need immediately.
 */
export async function Header() {
  const categories = await listCategories().catch(() => []);
  const allTopLevel = (Array.isArray(categories) ? categories : []).filter(
    (c) => !c.parentId,
  );
  const visibleCategories = allTopLevel.slice(0, 3);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 dark:border-ink-800 bg-white/85 dark:bg-ink-900 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-ink-900">
      <div className="container-page flex h-14 items-center justify-between gap-2 sm:h-16">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4 xl:gap-6">
          <MobileNav categories={allTopLevel} jobBoardNav={JOB_BOARD_NAV} />
          <Link href="/" className="shrink-0 flex items-center py-0.5">
            <Image
              src={devnexaLogoTransparent}
              alt="Devnexa"
              height={56}
              className="h-10 sm:h-12 w-auto object-contain origin-left contrast-125 drop-shadow-xs"
              priority
            />
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 lg:flex"
          >
            <NavLink href="/jobs">Jobs</NavLink>
            {allTopLevel.slice(0, 3).map((cat) => (
              <NavLink key={cat.id} href={`/category/${cat.slug}`}>
                {cat.name}
              </NavLink>
            ))}
            <NavDropdown
              label="More"
              href="#"
              categories={allTopLevel.slice(3).map((cat) => ({
                href: `/category/${cat.slug}`,
                label: cat.name,
              }))}
              resources={[
                { href: "/resources", label: "All Resources" },
                { href: "/career", label: "Career Content" },
                { href: "/companies", label: "Companies" },
              ]}
              tools={[
                { href: "/me/resume-ats", label: "Resume ATS Analysis" },
                { href: "/me/preferences", label: "Job Preferences" },
                { href: "/me/job-alerts", label: "Job Alerts" },
                { href: "/me/saved-jobs", label: "Saved Jobs" },
                { href: "/me/applications", label: "My Applications" },
              ]}
            />
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-md text-ink-500 dark:text-ink-400 transition hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-100 active:bg-ink-100 dark:active:bg-ink-800 sm:h-9 sm:w-9"
          >
            <Search size={19} />
          </Link>
          <Link
            href="/me/bookmarks"
            aria-label="Bookmarks"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-ink-500 dark:text-ink-400 transition hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-100 sm:flex"
          >
            <Bookmark size={19} />
          </Link>
          <ThemeToggle />
          <HeaderAuthActions />
        </div>
      </div>
    </header>
  );
}
