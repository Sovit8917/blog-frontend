import { apiFetch } from './client';
import type { Collection, CollectionDetail, CollectionMembership } from '@/types';

/** POST /me/collections — requires auth. */
export function createCollection(input: { name: string; description?: string; isPrivate?: boolean }) {
  return apiFetch<Collection>('/me/collections', {
    method: 'POST',
    body: JSON.stringify(input),
    revalidate: false,
  });
}

/** GET /me/collections — requires auth. Pass a forwarded cookie header for server components. */
export function listMyCollections(cookie?: string) {
  return apiFetch<Collection[]>('/me/collections', { cookie, revalidate: false });
}

/** GET /me/collections/:id — requires auth. Pass a forwarded cookie header for server components. */
export function getCollection(id: string, cookie?: string) {
  return apiFetch<CollectionDetail>(`/me/collections/${id}`, { cookie, revalidate: false });
}

/** PATCH /me/collections/:id — requires auth. */
export function updateCollection(
  id: string,
  input: { name?: string; description?: string; isPrivate?: boolean },
) {
  return apiFetch<Collection>(`/me/collections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
    revalidate: false,
  });
}

/** DELETE /me/collections/:id — requires auth. */
export function deleteCollection(id: string) {
  return apiFetch<{ deleted: boolean }>(`/me/collections/${id}`, {
    method: 'DELETE',
    revalidate: false,
  });
}

/** POST /me/collections/:id/items — requires auth. */
export function addPostToCollection(collectionId: string, postId: string) {
  return apiFetch<{ id: string }>(`/me/collections/${collectionId}/items`, {
    method: 'POST',
    body: JSON.stringify({ postId }),
    revalidate: false,
  });
}

/** DELETE /me/collections/:id/items/:postId — requires auth. */
export function removePostFromCollection(collectionId: string, postId: string) {
  return apiFetch<{ removed: boolean }>(`/me/collections/${collectionId}/items/${postId}`, {
    method: 'DELETE',
    revalidate: false,
  });
}

/** GET /me/collections/containing/:postId — which collections already hold this post. */
export function collectionsContainingPost(postId: string) {
  return apiFetch<CollectionMembership[]>(`/me/collections/containing/${postId}`, {
    revalidate: false,
  });
}
