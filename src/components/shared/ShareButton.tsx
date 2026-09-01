'use client';

import { Twitter, Linkedin, Link2, Facebook, Check, Share2, MessageCircle, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/api/analytics';
import { cn } from '@/lib/utils';

export type ShareContentType = 'post' | 'job' | 'company' | 'developer_resource';

export interface ShareButtonProps {
  url: string;
  title: string;
  /** Used for analytics attribution — id of the post/job being shared. */
  contentType?: ShareContentType;
  postId?: string;
  jobId?: string;
  /** Compact renders icon-only row, 'full' adds text labels, 'dropdown' renders a single share icon with a popup. */
  variant?: 'compact' | 'full' | 'dropdown';
  className?: string;
}

type Channel = 'copy_link' | 'whatsapp' | 'linkedin' | 'x' | 'facebook' | 'telegram' | 'native';

/**
 * Universal Share component (#9) — one component used everywhere content can
 * be shared (blog posts, job listings, company pages, developer resources).
 * Covers Copy Link (#10), WhatsApp (#11), LinkedIn (#12), X (#13), Facebook
 * (#14), and the native Web Share sheet on supported devices (#15). Every
 * click is recorded as a SHARE analytics event with a `channel` (#18) so the
 * admin "Share analytics" report can see what's working.
 */
export function ShareButton({ url, title, contentType, postId, jobId, variant = 'compact', className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // navigator.share is undefined during SSR and on desktop browsers without
  // Web Share support — only render the native button where it'll work.
  const [canNativeShare, setCanNativeShare] = useState(false);
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-share-container]')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  function track(channel: Channel) {
    trackEvent({ type: 'SHARE', channel, postId, jobId, path: typeof window !== 'undefined' ? window.location.pathname : undefined });
  }

  const links: { channel: Channel; icon: typeof Twitter; label: string; href: string }[] = [
    {
      channel: 'whatsapp',
      icon: MessageCircle,
      label: 'Share on WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`,
    },
    { channel: 'x', icon: Twitter, label: 'Share on X', href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}` },
    { channel: 'facebook', icon: Facebook, label: 'Share on Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
    { channel: 'telegram', icon: Send, label: 'Share on Telegram', href: `https://t.me/share/url?url=${encoded}&text=${encodedTitle}` },
    {
      channel: 'linkedin',
      icon: Linkedin,
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    },
  ];

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
      track('native');
    } catch (err) {
      // AbortError fires when the user just dismisses the share sheet — not a real failure/share.
      if ((err as DOMException)?.name !== 'AbortError') {
        await copy();
      }
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API can be blocked (insecure context, permissions) — fall back
      // to a manual selection prompt so copy still works.
      window.prompt('Copy this link:', url);
    }
    track('copy_link');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const iconButtonClass =
    'rounded-full p-2 text-ink-500 ring-1 ring-ink-200 transition hover:bg-brand-50 hover:text-brand-600 hover:ring-brand-200';
  const fullButtonClass =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-600 ring-1 ring-ink-200 transition hover:bg-ink-50 hover:text-ink-900';
  const itemClass = variant === 'full' ? fullButtonClass : iconButtonClass;

  if (variant === 'dropdown') {
    return (
      <div data-share-container className={cn('relative inline-flex items-center', className)}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (canNativeShare) {
              nativeShare();
            } else {
              setIsOpen((prev) => !prev);
            }
          }}
          aria-label="Share resource"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 ring-1 ring-ink-200 transition hover:bg-brand-50 hover:text-brand-600 hover:ring-brand-300"
        >
          <Share2 size={14} />
        </button>

        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-full right-0 mb-2 z-50 flex w-48 flex-col rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-400">
              Share to
            </div>
            {links.map(({ channel, icon: Icon, label, href }) => (
              <a
                key={channel}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track(channel);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
              >
                <Icon size={14} className="shrink-0 text-ink-400" />
                <span>{label.replace('Share on ', '')}</span>
              </a>
            ))}
            <button
              type="button"
              onClick={async () => {
                await copy();
                setTimeout(() => setIsOpen(false), 800);
              }}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {copied ? (
                <>
                  <Check size={14} className="shrink-0 text-green-600" />
                  <span className="text-green-600 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Link2 size={14} className="shrink-0 text-ink-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {canNativeShare && (
        <button onClick={nativeShare} aria-label="Share" className={itemClass}>
          <Share2 size={16} />
          {variant === 'full' && <span>Share</span>}
        </button>
      )}
      {links.map(({ channel, icon: Icon, label, href }) => (
        <a
          key={channel}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          onClick={() => track(channel)}
          className={itemClass}
        >
          <Icon size={16} />
          {variant === 'full' && <span>{label.replace('Share on ', '')}</span>}
        </a>
      ))}
      <button onClick={copy} aria-label="Copy link" className={itemClass}>
        {copied ? <Check size={16} className="text-green-600" /> : <Link2 size={16} />}
        {variant === 'full' && <span>{copied ? 'Copied' : 'Copy link'}</span>}
      </button>
    </div>
  );
}
