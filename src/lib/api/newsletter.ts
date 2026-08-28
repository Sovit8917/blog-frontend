import { apiFetch } from './client';

/** POST /newsletter/subscribe */
export function subscribeNewsletter(email: string, source?: string) {
  return apiFetch<{ status: string }>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, source }),
    revalidate: false,
  });
}
