import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listPostsByAuthor, getUserProfile, myFollowing } from '@/lib/api';
import { PostGrid } from '@/components/blog/PostGrid';
import { Avatar } from '@/components/ui/Avatar';
import { FollowButton } from '@/components/blog/FollowButton';
import { buildListMetadata } from '@/lib/seo/metadata';
import { getCurrentUser, getCookieHeader } from '@/lib/auth/session';

interface Props { params: { username: string }; searchParams: { cursor?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildListMetadata({
    title: `@${params.username}`,
    description: `Posts written by @${params.username}`,
    path: `/author/${params.username}`,
  });
}

export const revalidate = 300;

export default async function AuthorPage({ params, searchParams }: Props) {
  const [author, posts, viewer] = await Promise.all([
    getUserProfile(params.username).catch(() => null),
    listPostsByAuthor(params.username, { cursor: searchParams.cursor, limit: 9 }).catch(() => null),
    getCurrentUser().catch(() => null),
  ]);

  // Unlike posts (which may simply be empty for a real author), a missing
  // profile means the username doesn't exist at all — 404.
  if (!author) notFound();

  const isOwnProfile = viewer?.username === author.username;
  let initialFollowing = false;
  if (viewer && !isOwnProfile) {
    const following = await myFollowing(getCookieHeader()).catch(() => []);
    initialFollowing = following.some((f) => f.following.username === author.username);
  }

  return (
    <div className="bg-slate-50/50 py-8 lg:py-12">
      <div className="container-page space-y-8">
        <header className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm flex flex-wrap items-center gap-6">
          <Avatar src={author.avatarUrl} name={author.name || params.username} size={72} />
          <div className="flex-1">
            <h1 className="font-serif text-3xl font-extrabold text-ink-950">{author.name || `@${author.username}`}</h1>
            {author.bio && <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-600">{author.bio}</p>}
            <p className="mt-2 text-xs font-semibold text-brand-600">
              {author._count.posts} {author._count.posts === 1 ? 'post' : 'posts'} · {author._count.following} following
            </p>
          </div>
          <FollowButton
            username={author.username}
            initialFollowing={initialFollowing}
            initialFollowerCount={author._count.followers}
            isLoggedIn={!!viewer}
            isOwnProfile={isOwnProfile}
          />
        </header>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-ink-900">Articles by {author.name || `@${author.username}`}</h2>
          <PostGrid posts={posts?.items ?? []} priorityCount={3} />
        </div>
      </div>
    </div>
  );
}
