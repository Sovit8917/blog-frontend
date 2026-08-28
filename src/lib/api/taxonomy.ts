import { apiFetch } from './client';
import type { Category, Tag } from '@/types';

/** GET /categories */
export function listCategories() {
  return apiFetch<Category[]>('/categories', { revalidate: 3600, tags: ['categories'] });
}

/** GET /categories/:slug */
export function getCategory(slug: string) {
  return apiFetch<Category>(`/categories/${slug}`, { revalidate: 3600, tags: ['categories'] });
}

/** GET /tags */
export function listTags() {
  return apiFetch<Tag[]>('/tags', { revalidate: 3600, tags: ['tags'] });
}

/** GET /tags/:slug */
export function getTag(slug: string) {
  return apiFetch<Tag>(`/tags/${slug}`, { revalidate: 3600, tags: ['tags'] });
}
