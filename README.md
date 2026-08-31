# Blog Frontend (Next.js 14 · App Router · TypeScript)

Public blog-reading frontend for the `blog-backend` (NestJS/Prisma) API.
**No admin/CMS UI** — this only covers the reader-facing site. CMS routes
(`/cms/*`, `/admin/*`) exist on the backend but are intentionally not
consumed here.

Delivered in two phases, as requested.

---

## Phase 1 — Core reading experience & information architecture

**Goal: a fast, readable, fully-navigable blog with correct SEO plumbing.**

- [x] URL structure (below)
- [x] Page/site structure — Home, Post, Category, Tag, Author, Search
- [x] API contract layer (`src/lib/api/*`) — one typed function per backend
      endpoint, matching `blog-backend` routes/DTOs exactly
- [x] SEO — per-entity `generateMetadata`, JSON-LD (BlogPosting, Breadcrumb,
      Organization), `sitemap.ts`/`robots.ts` proxying the backend's own
      `/sitemap.xml` + `/robots.txt`
- [x] Responsive design system — Tailwind tokens, typography scale tuned
      for long-form reading, mobile nav drawer
- [x] Reading UX: table of contents, reading-progress bar, share bar,
      like/bookmark, threaded comments (read + submit)

## Phase 2 — Monetization, performance & polish

**Goal: make the site fast at scale and pay for itself.**

- [x] Advertisement placement system (`AdSlot`) wired to `GET /ads?placement=`
      + viewability-based impression tracking + click tracking
- [x] Affiliate link component wired to the backend's `GET /go/:slug`
      redirect+tracking endpoint, with mandatory FTC-style disclosure
- [x] Sponsored-post banner + `isSponsored` badge on cards
- [x] Caching strategy: per-endpoint `fetch` `revalidate` windows + cache
      `tags` for on-demand invalidation (`revalidateTag('posts')` etc. from
      a webhook once the backend adds one)
- [x] Image optimization (`next/image`, AVIF/WebP, long TTL for MinIO-hosted
      media), font optimization (`next/font`, self-hosted, no CLS)
- [x] Redirects for legacy URL patterns, immutable caching for static assets

Not built (out of scope per your instructions): admin/CMS screens, job
board pages (the backend has a `jobs` module but you asked for *blog*
frontend only — the sitemap still includes `/jobs/:slug` since the backend
emits it, but no page renders there yet), auth screens beyond stubs.

---

## 1. URL structure

| Path | Purpose | Backend source |
|---|---|---|
| `/` | Homepage — featured hero + latest grid | `GET /posts?sort=featured`, `GET /posts?sort=latest` |
| `/blog/:slug` | Post detail | `GET /posts/:slug` |
| `/category/:slug` | Posts in a category | `GET /categories/:slug`, `GET /posts?category=` |
| `/tag/:slug` | Posts with a tag | `GET /tags/:slug`, `GET /posts?tag=` |
| `/author/:username` | Author archive | `GET /posts?author=` |
| `/search?q=` | Full-text search | `GET /posts?search=` |
| `/sitemap.xml`, `/robots.txt` | Generated, proxy backend `/sitemap.xml` | — |

Slugs are the single canonical identifier everywhere (never database IDs in
URLs) — this matches the backend's `@unique slug` columns and its own
sitemap generator, so `/blog/:slug` etc. line up 1:1 with what
`SeoService.generateSitemap()` emits. `next.config.js` 301-redirects a
couple of plausible legacy patterns (`/post/:slug`, `/posts/:slug`) to the
canonical `/blog/:slug`.

## 2. Page / site structure

```
src/app/
  layout.tsx              root shell: fonts, header, footer, Organization JSON-LD
  page.tsx                home
  blog/[slug]/page.tsx     post detail
  category/[slug]/page.tsx
  tag/[slug]/page.tsx
  author/[username]/page.tsx
  search/page.tsx
  sitemap.ts, robots.ts
  loading.tsx, error.tsx, not-found.tsx
src/components/
  layout/    Header, Footer, MobileNav
  blog/      PostCard, PostGrid, FeaturedHero, PostContent, TableOfContents,
             ReadingProgress, ShareBar, LikeBookmarkBar, RelatedPosts, Sidebar
  ads/       AdSlot, AdImpressionTracker, AffiliateLink, SponsoredBanner
  comments/  CommentSection
  home/      NewsletterForm, NewsletterBanner
  ui/        Badge, Avatar, Button, Skeleton
src/lib/
  api/       client.ts + one file per resource (posts, taxonomy, engagement,
             monetization, newsletter, seo) — the API contract layer
  seo/       metadata.ts (Metadata builders), jsonld.ts
  fonts.ts, utils.ts
```

Every list page (`/`, `/category/:slug`, `/tag/:slug`) shares the same
`PostGrid` + `Sidebar` composition so the reading experience is consistent
site-wide.

## 3. SEO strategy

- **Per-entity precedence**: `seoTitle`/`seoDescription`/`ogImageUrl`/
  `canonicalUrl`/`noIndex` from the backend always win; otherwise metadata
  falls back to content (`title`, `excerpt`, stripped markdown body). See
  `lib/seo/metadata.ts: buildPostMetadata`.
- **Structured data**: `BlogPosting` + `BreadcrumbList` on post pages,
  `Organization` sitewide — via `lib/seo/jsonld.ts`.
- **Sitemap/robots**: `app/sitemap.ts` parses the backend's own
  `/sitemap.xml` (which already unions posts/categories/tags/jobs with
  correct `noIndex` filtering) instead of re-implementing that query
  client-side — single source of truth stays in the backend.
- **Canonical URLs** everywhere `canonicalUrl` isn't explicitly set,
  defaulting to the slug-based path.
- **`noIndex` respected** on posts/categories/jobs via `robots: {index:false}`.

## 4. API contracts

`src/lib/api/client.ts` is the single `fetch` wrapper: consistent base URL,
JSON headers, Bearer-token support, and Next's cache config
(`revalidate` + `tags`) per call. Every other file in `lib/api/` is a thin,
typed function per backend route — grep any of them and you'll find the
exact HTTP method + path it hits, e.g.:

```ts
// GET /posts/:slug
export function getPostBySlug(slug: string) {
  return apiFetch<Post>(`/posts/${slug}`, { revalidate: 120, tags: ['posts', `post:${slug}`] });
}
```

`src/types/index.ts` mirrors the Prisma models / DTOs field-for-field so no
mapping/transform layer is needed between API responses and components.

## 5. Responsive design system

Tailwind config (`tailwind.config.ts`) defines the whole visual language:
- `brand` / `ink` color scales (no ad-hoc hex values in components)
- Two-font system: Inter (UI chrome) + Source Serif 4 (article body) —
  serif improves comfort over long reading sessions
- `typography` plugin tuned for articles: 70ch measure, 1.85 line-height,
  scroll-margin on headings for anchor links
- Mobile-first grid: `PostGrid` is 1 col → 2 (sm) → 3 (lg); post detail
  goes single-column on mobile, gains a sticky ToC at `xl`
- `MobileNav` slide-in drawer under `lg`; sticky, blurred header at all sizes

## 6. Performance / caching strategy

- **Data cache**: every `apiFetch` call sets `next.revalidate` (list pages
  60s, post detail 120s, taxonomy 1h) plus `tags` so a future webhook can
  call `revalidateTag('posts')` for instant invalidation on publish/edit
  instead of waiting out the timer.
- **Images**: `next/image` with AVIF/WebP negotiation and a 30-day
  `minimumCacheTTL` (media is content-addressed on MinIO, safe to cache hard).
- **Fonts**: `next/font/google` — self-hosted at build time, zero
  layout-shift, no render-blocking Google Fonts request.
- **Static assets**: `Cache-Control: immutable` on `_next/static/*` via
  `next.config.js` headers.
- **Server components by default**: only the interactive leaves (like
  button, comment form, mobile nav, ToC, share bar) are `'use client'` —
  everything else streams as server-rendered HTML.

## 7. Advertisement + affiliate placement system

- **`<AdSlot placement="HEADER|SIDEBAR|IN_CONTENT|FOOTER|BETWEEN_POSTS|POPUP" />`**
  — server component, calls `GET /ads?placement=X`, renders nothing if no
  active ad (never a broken placeholder). Click-through hits
  `POST /ads/:id/click` before opening the target.
- **Viewability tracking**: `AdImpressionTracker` uses
  `IntersectionObserver` (≥50% visible for 1s — the IAB standard) and
  `navigator.sendBeacon` so impression counts reflect real views.
- **`<AffiliateLink slug="...">`** — points at the backend's
  `GET /go/:slug` redirect-and-log endpoint (never the raw merchant URL),
  rendered with `rel="sponsored nofollow"` and a visible external-link icon.
- **`<SponsoredBanner>`** — mandatory disclosure banner + `isSponsored`
  badge on cards for `sponsoredContent` posts, matching the `Sponsor` /
  `SponsoredContent` Prisma models.
- Placements used on the shipped pages: `HEADER` + `BETWEEN_POSTS` on home,
  `SIDEBAR` in the shared `Sidebar`, `IN_CONTENT` + `BETWEEN_POSTS` on post
  detail.

### Monetization: house ads + Google AdSense waterfall

`AdSlot` is a two-tier waterfall, not just a house-ad renderer:

1. **House ad** (`GET /ads?placement=X`) — direct-sold sponsor/affiliate ads.
   These win whenever one is active for the slot, since direct deals almost
   always pay better per-impression than programmatic.
2. **Google AdSense fallback** — if no house ad is active (nothing booked,
   campaign paused, budget exhausted), `AdSlot` renders a `GoogleAdUnit`
   instead of leaving the space empty and unmonetized. If neither is
   configured, the slot renders nothing — never a broken placeholder.

**Preferred setup: the admin panel.** Publisher ID, client ID, and per-
placement ad-unit slot IDs are editable at Settings → "Ad network (Google
AdSense)" in blog-admin-frontend, stored as a public `monetization` setting
group (`GET/POST /cms/settings`, publicly readable at `GET /settings` since
none of these values are secret — they're embedded in client-side script
tags either way). Changes there go live on the site immediately, no
frontend rebuild/redeploy required.

`NEXT_PUBLIC_ADSENSE_*` env vars still work as a deploy-time fallback for
anyone who hasn't configured it in the admin panel (see
`getAdsenseSettings` in `src/lib/api/monetization.ts`, which checks admin
settings first and falls back to these):

```bash
# .env.local — only needed if not configuring via the admin panel
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXXX   # AdSense > Account
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX   # same number, ca-pub- prefix
NEXT_PUBLIC_ADSENSE_SLOT_HEADER=1111111111
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=2222222222
NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT=3333333333
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=4444444444
NEXT_PUBLIC_ADSENSE_SLOT_BETWEEN_POSTS=5555555555
```

- `GoogleAdSenseScript` (loaded once in the root layout) injects the AdSense
  loader tag site-wide — required even for manual ad units, not just Auto
  Ads. It renders nothing if no client ID is configured anywhere, so
  local/staging environments without an approved AdSense account are
  unaffected.
- `/ads.txt` is served dynamically from the same settings/env source
  (`src/app/ads.txt/route.ts`) rather than a static file. A missing or wrong
  `ads.txt` is one of the most common causes of AdSense "limited ads" /
  reduced fill, so this can't silently drift from the publisher ID used
  elsewhere.
- Placements left blank in the admin panel (or unset in env) simply get no
  AdSense fallback — house ads still work there regardless. `POPUP` has no
  admin field at all, since most AdSense policies frown on interstitial-style
  placement.
- Auto Ads (Google's algorithmic extra placements) is a per-site toggle in
  the AdSense dashboard, not a code flag — deliberately left off by default
  there, since it tends to visually clash with these hand-placed slots.
- **Before going live**: get the domain verified and approved in AdSense
  first (Sites > Add site), or ad units will render as blank space until
  approval clears — this can take anywhere from a day to a couple of weeks.
- **Layout shift**: `GoogleAdUnit` reserves a slot-shaped box via the same
  `SLOT_SIZES` map used for house ads, but AdSense's actual rendered size
  can still vary slightly by format — worth a Lighthouse/CLS check after
  wiring in real slot IDs.

### Consent (Google Consent Mode v2)

`ConsentBanner` (root layout, shown to every visitor once — see
`src/lib/ads/consent.ts`) gates ad personalization/measurement cookies via
Google's Consent Mode v2:

- `GoogleAdSenseScript` injects a `beforeInteractive` snippet that sets
  `ad_storage` / `ad_user_data` / `ad_personalization` / `analytics_storage`
  to `'denied'` by default, before the AdSense loader script runs. AdSense
  reads this signal itself — the denied default means it serves
  non-personalized ads only, until/unless the visitor accepts.
- Choosing Accept/Decline in the banner calls `gtag('consent', 'update', …)`
  immediately (no reload needed) and stores the choice in `localStorage` so
  the banner doesn't reappear on the next visit.
- Declining doesn't disable ads — it withholds personalization/measurement
  consent, so AdSense falls back to non-personalized (still revenue-
  generating, just lower-CPM) ads instead.
- This is a self-hosted, minimal Consent Mode implementation — not a full
  IAB TCF-certified CMP. It's shown to every visitor rather than gated by
  geo-IP, since there's no geo lookup in this codebase and "only show it in
  the EU" is easy to get wrong. If you need TCF/GDPR compliance at a more
  rigorous level (e.g. per-vendor consent, TC string generation for ad
  exchanges beyond AdSense), swap this for a certified CMP — Google's
  [approved CMP list](https://support.google.com/adsense/answer/13554116).
- `ConsentBanner` intentionally has no "Learn more" link yet, since this
  repo has no `/privacy` page — add one and link it in
  `ConsentBanner.tsx` (see the `TODO` there) before relying on this for
  actual compliance.

### Ideas for going further on monetization

- **Header bidding** (e.g. Prebid.js) if AdSense fill/CPM alone plateaus —
  runs AdSense alongside other demand sources (Amazon TAM, other SSPs) in
  parallel and serves whichever bids highest per-impression. Meaningfully
  more setup than a single network, worth it once traffic justifies it.
- **Newsletter/lead-gen slots** using the existing `Advertisement` model —
  a `NEWSLETTER` placement alongside the ad ones, sold the same way as
  `SPONSOR`/`AFFILIATE` inventory today.
- **Reader-funded tier**: the `for-you`/`me` auth surface already exists;
  an ad-free subscription is a small addition — gate `AdSlot`'s render on
  `viewer?.plan !== 'AD_FREE'`.

---

## Setup

```bash
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at the NestJS backend
npm install
npm run dev
```
