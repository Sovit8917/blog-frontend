import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * On-demand cache invalidation webhook. The backend calls this immediately
 * after any mutation that changes published content (post publish/update/
 * delete, job/company/resource/learning-path CRUD, etc.) so readers stop
 * seeing stale data without waiting out the per-endpoint `revalidate` window
 * set in lib/api/* (e.g. 60s on the homepage, 120s on post detail).
 *
 * Every `apiFetch` call already tags its request (see lib/api/client.ts's
 * `tags` option) — this route just needs to be told which tags changed and
 * calls `revalidateTag` for each. `paths` is also accepted for the rare case
 * a route isn't reachable by tag alone (e.g. a static shell).
 *
 * Auth: a shared secret, since this is a public HTTP endpoint but must only
 * be callable by the backend. Sent as `x-revalidate-secret` (also accepted
 * as `?secret=` for simple curl/webhook testing).
 */
export async function POST(req: NextRequest) {
  const configuredSecret = process.env.REVALIDATE_SECRET;
  if (!configuredSecret) {
    // Misconfiguration, not a caller error — fail loudly server-side rather
    // than silently accepting unauthenticated revalidation requests.
    console.error('[revalidate] REVALIDATE_SECRET is not set; refusing all requests');
    return NextResponse.json({ revalidated: false, message: 'Revalidation is not configured' }, { status: 500 });
  }

  const headerSecret = req.headers.get('x-revalidate-secret');
  const querySecret = req.nextUrl.searchParams.get('secret');
  if (headerSecret !== configuredSecret && querySecret !== configuredSecret) {
    return NextResponse.json({ revalidated: false, message: 'Invalid secret' }, { status: 401 });
  }

  let body: { tags?: string[]; paths?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    // No JSON body is fine as long as at least a tag/path came via query string.
  }

  const tagsParam = req.nextUrl.searchParams.get('tag');
  const pathParam = req.nextUrl.searchParams.get('path');

  const tags = [...(body.tags ?? []), ...(tagsParam ? [tagsParam] : [])];
  const paths = [...(body.paths ?? []), ...(pathParam ? [pathParam] : [])];

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json({ revalidated: false, message: 'No tags or paths provided' }, { status: 400 });
  }

  for (const tag of tags) revalidateTag(tag);
  for (const path of paths) revalidatePath(path);

  return NextResponse.json({ revalidated: true, tags, paths, now: Date.now() });
}
