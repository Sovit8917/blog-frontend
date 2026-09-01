import Image from "next/image";
import Link from "next/link";
import { Search, Bookmark } from "lucide-react";
import { listCategories } from "@/lib/api";
import devnexaLogoTransparent from "@/assests/devnexa-logo-transpernet.png";
import { MobileNav } from "./MobileNav";
import { HeaderAuthActions } from "./HeaderAuthActions";
import { NavLink } from "./NavLink";
import { NavDropdown } from "./NavDropdown";

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
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container-page flex h-14 items-center justify-between gap-2 sm:h-16">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4 xl:gap-6">
          <MobileNav categories={allTopLevel} jobBoardNav={JOB_BOARD_NAV} />
          <Link href="/" className="shrink-0 flex items-center py-0.5">
            <Image
              src={devnexaLogoTransparent}
              alt="Devnexa"
              height={56}
              className="h-11 sm:h-13 max-h-14 w-auto object-contain scale-[1.18] origin-left contrast-125 brightness-95"
              priority
            />
          </Link>
          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 lg:flex"
          >
            <NavLink href="/jobs">Jobs</NavLink>
            <NavLink href="/category/developer-resources">Developer Resources</NavLink>
            <NavLink href="/resources">All Resources</NavLink>
            <NavDropdown
              label="More"
              href="#"
              items={[
                { href: "/career", label: "Career Content" },
                { href: "/companies", label: "Companies" },
                ...visibleCategories.map((cat) => ({
                  href: `/category/${cat.slug}`,
                  label: cat.name,
                })),
              ]}
            />
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Link
            href="/search"
            aria-label="Search"
            className="rounded-md p-2 text-ink-500 transition hover:bg-ink-50 hover:text-ink-900"
          >
            <Search size={19} />
          </Link>
          <Link
            href="/me/bookmarks"
            aria-label="Bookmarks"
            className="hidden rounded-md p-2 text-ink-500 transition hover:bg-ink-50 hover:text-ink-900 sm:inline-flex"
          >
            <Bookmark size={19} />
          </Link>
          <HeaderAuthActions />
        </div>
      </div>
    </header>
  );
}
