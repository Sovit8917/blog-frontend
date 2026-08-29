'use client';

import { Twitter, Linkedin, Link2, Facebook, Check, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  // navigator.share is undefined during SSR and on desktop browsers without
  // Web Share support — only render the native button where it'll work.
  const [canNativeShare, setCanNativeShare] = useState(false);
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const links = [
    { icon: Twitter, label: 'Share on X', href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}` },
    { icon: Linkedin, label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { icon: Facebook, label: 'Share on Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
  ];

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch (err) {
      // AbortError fires when the user just dismisses the share sheet — not a real failure.
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
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2">
      {canNativeShare && (
        <button
          onClick={nativeShare}
          aria-label="Share"
          className="rounded-full p-2 text-ink-500 ring-1 ring-ink-200 transition hover:bg-ink-50 hover:text-ink-900"
        >
          <Share2 size={16} />
        </button>
      )}
      {links.map(({ icon: Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="rounded-full p-2 text-ink-500 ring-1 ring-ink-200 transition hover:bg-ink-50 hover:text-ink-900"
        >
          <Icon size={16} />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="rounded-full p-2 text-ink-500 ring-1 ring-ink-200 transition hover:bg-ink-50 hover:text-ink-900"
      >
        {copied ? <Check size={16} className="text-green-600" /> : <Link2 size={16} />}
      </button>
    </div>
  );
}
