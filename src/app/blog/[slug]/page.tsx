import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getPostBySlug,
  listRelatedPosts,
  listComments,
  myFollowing,
  listJobsRelatedToPost,
} from "@/lib/api";
import { getCurrentUser, getCookieHeader } from "@/lib/auth/session";
import { buildPostMetadata } from "@/lib/seo/metadata";
import { postJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/seo/metadata";
import { PostContent } from "@/components/blog/PostContent";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareBar } from "@/components/blog/ShareBar";
import { LikeBookmarkBar } from "@/components/blog/LikeBookmarkBar";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { FollowButton } from "@/components/blog/FollowButton";
import { RelatedJobs } from "@/components/jobs/RelatedJobs";
import { Sidebar } from "@/components/blog/Sidebar";
import { CommentSection } from "@/components/comments/CommentSection";
import { SponsoredBanner } from "@/components/ads/SponsoredBanner";
import { AdSlot } from "@/components/ads/AdSlot";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatDate, readingTimeLabel } from "@/lib/utils";

export const revalidate = 120;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post) return {};
  return buildPostMetadata(post);
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post) notFound();

  const [related, comments] = await Promise.all([
    listRelatedPosts(post).catch(() => []),
    listComments(post.id).catch(() => []),
  ]);

  const [viewer, relatedJobs] = await Promise.all([
    getCurrentUser().catch(() => null),
    listJobsRelatedToPost(post.id).catch(() => []),
  ]);

  const isOwnPost = viewer?.username === post.author.username;
  let initialFollowing = false;
  if (viewer && !isOwnPost) {
    const following = await myFollowing(getCookieHeader()).catch(() => []);
    initialFollowing = following.some(
      (f) => f.following.username === post.author.username,
    );
  }

  const url = `${SITE.url}/blog/${post.slug}`;

  return (
    <>
      <ReadingProgress postId={post.id} isLoggedIn={!!viewer} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              ...(post.category
                ? [
                    {
                      name: post.category.name,
                      url: `${SITE.url}/category/${post.category.slug}`,
                    },
                  ]
                : []),
              { name: post.title, url },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd(post)) }}
      />

      <div className="bg-slate-50/50 py-8 lg:py-12">
        <article className="container-page">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-ink-400">
            <Link href="/" className="transition hover:text-brand-600">
              Home
            </Link>
            {post.category && (
              <>
                <span className="text-ink-300">/</span>
                <Link
                  href={`/category/${post.category.slug}`}
                  className="transition hover:text-brand-600"
                >
                  {post.category.name}
                </Link>
              </>
            )}
            <span className="text-ink-300">/</span>
            <span className="truncate max-w-[250px] text-ink-600">
              {post.title}
            </span>
          </nav>

          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 xl:grid-cols-[240px_1fr_320px]">
            {/* Left Rail: Table of Contents */}
            <div className="hidden xl:block">
              <div className="sticky top-24">
                <TableOfContents />
              </div>
            </div>

            {/* Middle Main Column: Blog Article */}
            <div className="mx-auto w-full max-w-4xl min-w-0">
              <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-10 lg:p-12 shadow-sm">
                {post.sponsoredContent && (
                  <SponsoredBanner sponsored={post.sponsoredContent} />
                )}

                {/* Category & Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {post.category && (
                    <Link href={`/category/${post.category.slug}`}>
                      <Badge
                        variant="brand"
                        className="px-3 py-1 text-xs font-semibold shadow-sm"
                      >
                        {post.category.name}
                      </Badge>
                    </Link>
                  )}
                  {post.tags
                    ?.filter((t) => t && (t.name || t.slug))
                    .map((t, idx) => {
                      const tagSlug = t.slug || t.name?.toLowerCase().replace(/\s+/g, "-");
                      const tagName = t.name || t.slug;
                      if (!tagSlug || !tagName) return null;
                      return (
                        <Link key={t.id || tagSlug || idx} href={`/tag/${tagSlug}`}>
                          <Badge
                            variant="outline"
                            className="px-2.5 py-1 text-xs font-medium transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700"
                          >
                            #{tagName}
                          </Badge>
                        </Link>
                      );
                    })}
                </div>

                {/* Title & Excerpt */}
                <h1 className="mt-5 font-serif text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl lg:text-5xl lg:leading-[1.18]">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="mt-4 text-lg leading-relaxed text-ink-600 sm:text-xl font-normal border-l-4 border-brand-400 pl-4 py-0.5 bg-slate-50/50 rounded-r-lg">
                    {post.excerpt}
                  </p>
                )}

                {/* Author & Action Bar */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-4">
                  <Link
                    href={`/author/${post.author.username}`}
                    className="group flex items-center gap-3.5"
                  >
                    <Avatar
                      src={post.author.avatarUrl}
                      name={post.author.name}
                      size={44}
                    />
                    <div>
                      <p className="text-sm font-bold text-ink-900 transition group-hover:text-brand-600">
                        {post.author.name}
                      </p>
                      <p className="text-xs font-medium text-ink-400">
                        {post.publishedAt && formatDate(post.publishedAt)} ·{" "}
                        {readingTimeLabel(post.readingTimeMins)}
                      </p>
                    </div>
                  </Link>
                  {!isOwnPost && (
                    <FollowButton
                      username={post.author.username}
                      initialFollowing={initialFollowing}
                      initialFollowerCount={0}
                      isLoggedIn={!!viewer}
                      isOwnProfile={isOwnPost}
                      hideCount
                    />
                  )}
                  <div className="flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2 border border-slate-200/60">
                    <LikeBookmarkBar
                      postId={post.id}
                      initialLikes={post.likeCount}
                    />
                    <div className="h-4 w-px bg-slate-200" />
                    <ShareBar url={url} title={post.title} />
                  </div>
                </div>

                {/* Optional Cover Image */}
                {post.coverImageUrl && (
                  <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 896px"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="mt-10">
                  <PostContent content={post.content} />
                </div>

                {/* In-content Ad */}
                <div className="my-10">
                  <AdSlot placement="IN_CONTENT" />
                </div>

                {/* Footer Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
                  <LikeBookmarkBar
                    postId={post.id}
                    initialLikes={post.likeCount}
                  />
                  <ShareBar url={url} title={post.title} />
                </div>

                {/* Comments Section */}
                <CommentSection postId={post.id} initialComments={comments} />
              </div>
            </div>

            {/* Right Rail: Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </div>
          </div>
        </article>
      </div>

      <div className="container-page">
        <AdSlot placement="BETWEEN_POSTS" className="mb-12" />
        <RelatedPosts posts={related} />
        <RelatedJobs jobs={relatedJobs} />
      </div>
    </>
  );
}
