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
        className="relative block aspect-[16/9] overflow-hidden rounded-xl bg-ink-100"
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
          <div className="flex h-full items-center justify-center text-4xl font-bold text-ink-200">
            {post.title[0]}
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
          <time dateTime={post.publishedAt} className="text-xs text-ink-400">
            {formatDate(post.publishedAt)}
          </time>
        )}
      </div>

      <Link href={`/blog/${post.slug}`} className="mt-2">
        <h3 className="text-lg font-semibold leading-snug text-ink-900 transition group-hover:text-brand-600">
          {post.title}
        </h3>
      </Link>

      {post.excerpt && (
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
          {post.excerpt}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <Link
          href={`/author/${post.author.username}`}
          className="flex items-center gap-2"
        >
          <Avatar
            src={post.author.avatarUrl}
            name={post.author.name}
            size={24}
          />
          <span className="text-sm font-medium text-ink-600">
            {post.author.name}
          </span>
        </Link>
        <div className="flex items-center gap-3 text-xs text-ink-400">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {readingTimeLabel(post.readingTimeMins)}
          </span>
          <span className="hidden items-center gap-1 sm:flex">
            <Heart size={13} />
            {post.likeCount}
          </span>
          <span className="hidden items-center gap-1 sm:flex">
            <MessageCircle size={13} />
            {post.commentCount}
          </span>
        </div>
      </div>
    </article>
  );
}
