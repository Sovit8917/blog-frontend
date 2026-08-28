import Link from 'next/link';
import Image from 'next/image';
import type { PostCard as PostCardType } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, readingTimeLabel } from '@/lib/utils';
import { PostCard } from './PostCard';

/** Homepage hero: one large featured story + up to 2 secondary stories beside it. */
export function FeaturedHero({ posts }: { posts: PostCardType[] }) {
  const [main, ...rest] = Array.isArray(posts) ? posts : [];
  if (!main) return null;

  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <Link href={`/blog/${main.slug}`} className="group relative col-span-2 block overflow-hidden rounded-2xl">
        <div className="relative aspect-[16/10] w-full bg-ink-100 sm:aspect-[16/8]">
          {main.coverImageUrl && (
            <Image
              src={main.coverImageUrl}
              alt={main.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            {main.category && <Badge variant="brand">{main.category.name}</Badge>}
            {main.isSponsored && <Badge variant="sponsor">Sponsored</Badge>}
          </div>
          <h1 className="mt-3 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            {main.title}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <Avatar src={main.author.avatarUrl} name={main.author.name} size={32} />
            <div className="text-sm text-white/90">
              <span className="font-medium">{main.author.name}</span>
              <span className="mx-1.5">·</span>
              {main.publishedAt && <span>{formatDate(main.publishedAt)}</span>}
              <span className="mx-1.5">·</span>
              <span>{readingTimeLabel(main.readingTimeMins)}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-8">
        {rest.slice(0, 2).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
