'use client';

import { Twitter, Linkedin, Link2, Facebook, Check } from 'lucide-react';
import { useState } from 'react';

export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { icon: Twitter, label: 'Share on X', href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}` },
    { icon: Linkedin, label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { icon: Facebook, label: 'Share on Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
  ];

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2">
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
