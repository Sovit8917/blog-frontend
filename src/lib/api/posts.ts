import { apiFetch, qs } from './client';
import type { CursorPage, ListPostsParams, Post, PostCard } from '@/types';

/** GET /posts — public paginated feed. Revalidated every 60s + tag `posts`. */
export function listPosts(params: ListPostsParams = {}) {
  return apiFetch<CursorPage<PostCard>>(`/posts${qs(params as Record<string, any>)}`, {
    revalidate: 60,
    tags: ['posts'],
  });
}

/** GET /posts?sort=featured&limit=n — for hero/featured rail on the homepage. */
export function listFeaturedPosts(limit = 5) {
  return listPosts({ sort: 'featured', limit });
}

/** GET /posts?sort=trending&limit=n — for "Trending now" sidebar widget. */
export function listTrendingPosts(limit = 5) {
  return listPosts({ sort: 'trending', limit });
}

/** GET /posts/:slug — full post detail incl. content, SEO fields, sponsorship. */
export function getPostBySlug(slug: string) {
  return apiFetch<Post>(`/posts/${slug}`, {
    revalidate: 120,
    tags: ['posts', `post:${slug}`],
  });
}

/** GET /posts?category=slug */
export function listPostsByCategory(categorySlug: string, params: ListPostsParams = {}) {
  return listPosts({ ...params, category: categorySlug });
}

/** GET /posts?tag=slug */
export function listPostsByTag(tagSlug: string, params: ListPostsParams = {}) {
  return listPosts({ ...params, tag: tagSlug });
}

/** GET /posts?author=username */
export function listPostsByAuthor(username: string, params: ListPostsParams = {}) {
  return listPosts({ ...params, author: username });
}

/** GET /posts?search=q */
export function searchPosts(query: string, params: ListPostsParams = {}) {
  return listPosts({ ...params, search: query, sort: undefined });
}

/**
 * "Related posts": same category, excluding current post. The backend doesn't
 * expose a dedicated endpoint yet, so this composes /posts client-side —
 * swap for a real `/posts/:slug/related` call if/when Phase 3 adds one.
 */
export async function listRelatedPosts(post: Pick<Post, 'slug' | 'category'>, limit = 4) {
  if (!post.category) return [];
  const page = await listPostsByCategory(post.category.slug, { limit: limit + 1 });
  return page.items.filter((p) => p.slug !== post.slug).slice(0, limit);
}
