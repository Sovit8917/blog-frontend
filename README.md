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

---

## Setup

```bash
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at the NestJS backend
npm install
npm run dev
```
