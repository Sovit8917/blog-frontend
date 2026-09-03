'use client';

import { Check, Copy, Share2 } from 'lucide-react';
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

export function ShareButton({ url, title, contentType, postId, jobId, variant = 'compact', className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  const links = [
    {
      channel: 'whatsapp' as Channel,
      label: 'Share on WhatsApp',
      hoverStyle: 'hover:border-[#25D366] hover:bg-[#25D366] hover:shadow-[#25D366]/20',
      iconColor: 'fill-[#25D366]',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encoded}`,
      svgPath: 'M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29s-1.47-.73-1.7-.81c-.23-.09-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43-.14-.01-.3-.01-.47-.01Z',
    },
    {
      channel: 'linkedin' as Channel,
      label: 'Share on LinkedIn',
      hoverStyle: 'hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:shadow-[#0A66C2]/20',
      iconColor: 'fill-[#0A66C2]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      svgPath: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25a1.62 1.62 0 0 0-1.63 1.62 1.63 1.63 0 1 0 3.25 0c0-.9-.73-1.62-1.62-1.62Z',
    },
    {
      channel: 'telegram' as Channel,
      label: 'Share on Telegram',
      hoverStyle: 'hover:border-[#229ED9] hover:bg-[#229ED9] hover:shadow-[#229ED9]/20',
      iconColor: 'fill-[#229ED9]',
      href: `https://t.me/share/url?url=${encoded}&text=${encodedTitle}`,
      svgPath: 'm20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.67c.458 0 .66-.21.916-.458l2.199-2.138 4.573 3.378c.843.464 1.448.225 1.658-.785l2.997-14.113c.307-1.233-.472-1.792-1.506-1.521z',
    },
    {
      channel: 'x' as Channel,
      label: 'Share on X',
      hoverStyle: 'hover:border-black hover:bg-black hover:shadow-black/20',
      iconColor: 'fill-black',
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      svgPath: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    },
    {
      channel: 'facebook' as Channel,
      label: 'Share on Facebook',
      hoverStyle: 'hover:border-[#1877F2] hover:bg-[#1877F2] hover:shadow-[#1877F2]/20',
      iconColor: 'fill-[#1877F2]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      svgPath: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    },
  ];

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
      track('native');
    } catch (err) {
      if ((err as DOMException)?.name !== 'AbortError') {
        await copy();
      }
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copy this link:', url);
    }
    track('copy_link');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <Share2 size={15} />
        </button>

        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-full right-0 mb-2 z-50 flex w-48 flex-col rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Share to
            </div>
            {links.map(({ channel, label, href, svgPath, iconColor }) => (
              <a
                key={channel}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track(channel);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <svg className={cn('h-4 w-4 shrink-0', iconColor)} viewBox="0 0 24 24">
                  <path d={svgPath} />
                </svg>
                <span>{label.replace('Share on ', '')}</span>
              </a>
            ))}
            <button
              type="button"
              onClick={async () => {
                await copy();
                setTimeout(() => setIsOpen(false), 1000);
              }}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {copied ? (
                <>
                  <Check size={15} className="shrink-0 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={15} className="shrink-0 text-slate-500" />
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
        <button
          onClick={nativeShare}
          aria-label="Share"
          className="group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5"
        >
          <Share2 size={16} className="text-slate-600 transition-colors group-hover:text-slate-900" />
        </button>
      )}

      {links.map(({ channel, label, href, svgPath, iconColor, hoverStyle }) => (
        <a
          key={channel}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          onClick={() => track(channel)}
          className={cn(
            'group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
            hoverStyle,
          )}
        >
          <svg className={cn('h-[17px] w-[17px] transition-colors group-hover:fill-white', iconColor)} viewBox="0 0 24 24">
            <path d={svgPath} />
          </svg>
        </a>
      ))}

      {/* Copy Link button */}
      <button
        onClick={copy}
        aria-label="Copy link"
        className={cn(
          'group flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5',
          copied
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
            : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900',
        )}
      >
        {copied ? (
          <>
            <Check size={14} className="text-emerald-600 animate-in zoom-in-75 duration-100" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy size={14} className="text-slate-500 group-hover:text-slate-800 transition-colors" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
