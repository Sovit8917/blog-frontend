import Link from "next/link";
import Image from "next/image";
import { Clock, MessageCircle, Heart } from "lucide-react";
import type { PostCard as PostCardType } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, readingTimeLabel } from "@/lib/utils";

export function PostCard({
  post,
  priority = false,
}: {
  post: PostCardType;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/9] overflow-hidden rounded-xl bg-ink-100 dark:bg-ink-800"
      >
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-ink-100 dark:bg-ink-800 text-ink-300 dark:text-ink-600">
            <span className="text-3xl font-bold tracking-wider opacity-60">
              {post.title.trim()[0]?.toUpperCase() || 'D'}
            </span>
          </div>
        )}
        {post.isSponsored && (
          <Badge variant="sponsor" className="absolute left-3 top-3">
            Sponsored
          </Badge>
        )}
      </Link>

      <div className="mt-3 flex items-center gap-2">
        {post.category && (
          <Link href={`/category/${post.category.slug}`}>
            <Badge variant="brand">{post.category.name}</Badge>
          </Link>
        )}
        {post.publishedAt && (
          <time dateTime={post.publishedAt} className="text-xs text-ink-400 dark:text-ink-500">
            {formatDate(post.publishedAt)}
          </time>
        )}
      </div>

      <Link href={`/blog/${post.slug}`} className="mt-2">
        <h3 className="text-lg font-semibold leading-snug text-ink-900 dark:text-ink-100 transition group-hover:text-brand-600 dark:group-hover:text-brand-400">
          {post.title}
        </h3>
      </Link>

      {post.excerpt && (
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
          {post.excerpt}
        </p>
      )}

      <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-ink-100/60 dark:border-ink-800/60 text-xs">
        <Link
          href={`/author/${post.author.username}`}
          className="flex min-w-0 items-center gap-1.5 hover:opacity-80 transition"
        >
          <Avatar
            src={post.author.avatarUrl}
            name={post.author.name}
            size={22}
            className="shrink-0"
          />
          <span className="truncate font-medium text-ink-700 dark:text-ink-300">
            {post.author.name}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2.5 text-ink-400 dark:text-ink-500">
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            <span className="whitespace-nowrap">{post.readingTimeMins || 1} min</span>
          </span>
          {typeof post.likeCount === 'number' && (
            <span className="hidden items-center gap-1 sm:inline-flex">
              <Heart size={12} />
              {post.likeCount}
            </span>
          )}
          {typeof post.commentCount === 'number' && (
            <span className="hidden items-center gap-1 sm:inline-flex">
              <MessageCircle size={12} />
              {post.commentCount}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
