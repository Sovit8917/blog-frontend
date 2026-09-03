'use client';

import Link from 'next/link';
import { Briefcase, ExternalLink, Star } from 'lucide-react';
import { recordResourceClick } from '@/lib/api';
import { ShareButton } from '@/components/shared/ShareButton';
import type { DeveloperResource } from '@/types';

const TYPE_LABEL: Record<DeveloperResource['resourceType'], string> = {
  TOOL: 'Tool',
  LIBRARY: 'Library',
  TUTORIAL: 'Tutorial',
  COURSE: 'Course',
  DOCUMENTATION: 'Docs',
  COMMUNITY: 'Community',
  OTHER: 'Resource',
};

/**
 * There's no on-site detail page for a resource (it's a curated pointer to
 * an external tool/tutorial, not our own content) — so the whole card used
 * to just be one big `<a href={resource.url}>`. That made it impossible to
 * add a Share button: ShareButton renders its own `<a>`/`<button>`
 * elements, and nesting interactive elements inside an anchor is invalid
 * HTML and makes every click (share or not) fire the outer link's
 * navigation.
 *
 * Fixed with the "stretched link" pattern instead: the outer element is now
 * a plain `<div>`, with an absolutely-positioned anchor filling it (z-0) so
 * the card is still clickable everywhere. The ShareButton is a normal
 * sibling on top (z-10), so its own clicks never bubble into that anchor.
 */
export function ResourceCard({ resource }: { resource: DeveloperResource }) {
  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-ink-100 dark:border-ink-800 p-5 transition hover:border-brand-200 dark:hover:border-brand-700 hover:shadow-sm">
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        // Click tracking is fire-and-forget — it must never delay or block
        // the outbound navigation the visitor actually asked for.
        onClick={() => recordResourceClick(resource.id)}
        aria-label={resource.title}
        className="absolute inset-0 z-0 rounded-xl"
      />

      <div className="pointer-events-none relative z-[1] flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-50 dark:bg-ink-900">
          {resource.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resource.iconUrl} alt="" className="h-6 w-6 object-contain" />
          ) : (
            <span className="text-sm font-bold text-ink-400 dark:text-ink-500">{resource.title[0]}</span>
          )}
        </div>
        {resource.isFeatured && (
          <span className="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-100 dark:ring-amber-800">
            <Star size={10} className="fill-amber-500 text-amber-500" /> Featured
          </span>
        )}
      </div>

      <div className="pointer-events-none relative z-[1]">
        <h3 className="flex items-center gap-1.5 font-semibold text-ink-900 dark:text-ink-100 transition group-hover:text-brand-600 dark:group-hover:text-brand-400">
          {resource.title}
          <ExternalLink size={13} className="shrink-0 text-ink-300 dark:text-ink-600 transition group-hover:text-brand-500 dark:group-hover:text-brand-400" />
        </h3>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">
          {TYPE_LABEL[resource.resourceType]}
        </p>
      </div>

      {resource.description && (
        <p className="pointer-events-none relative z-[1] line-clamp-2 text-sm text-ink-500 dark:text-ink-400">{resource.description}</p>
      )}

      {/* Resource -> Job linking (P1): editor-picked open roles related to
          this resource (e.g. a "Free React course" resource pointing at open
          React jobs). Sits above the stretched anchor so these links are
          independently clickable rather than triggering the outbound resource.url nav. */}
      {resource.linkedJobs && resource.linkedJobs.length > 0 && (
        <div className="relative z-[1] flex flex-wrap items-center gap-1.5 border-t border-ink-50 dark:border-ink-900 pt-2.5">
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-500">
            <Briefcase size={11} /> Related jobs
          </span>
          {resource.linkedJobs.slice(0, 3).map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              className="pointer-events-auto relative z-10 rounded-full bg-brand-50 dark:bg-brand-900/40 px-2.5 py-1 text-[11px] font-medium text-brand-700 dark:text-brand-400 transition hover:bg-brand-100 dark:hover:bg-brand-900/40"
            >
              {job.title}
            </Link>
          ))}
        </div>
      )}

      <div className="relative z-[1] mt-auto flex items-end justify-between gap-2 pt-1">
        {resource.tags.length > 0 ? (
          <div className="pointer-events-none flex flex-wrap gap-1.5">
            {resource.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full bg-ink-50 dark:bg-ink-900 px-2 py-0.5 text-[11px] font-medium text-ink-500 dark:text-ink-400">
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <span />
        )}
        {/* Sits above the stretched anchor (z-10, no pointer-events-none) so its
            own clicks are handled here instead of triggering the card's link. */}
        <ShareButton
          url={resource.url}
          title={resource.title}
          contentType="developer_resource"
          variant="dropdown"
          className="pointer-events-auto relative z-10 shrink-0"
        />
      </div>
    </div>
  );
}
