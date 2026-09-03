import { Rss } from 'lucide-react';

const CHANNELS = [
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL || 'https://linkedin.com',
    bgColor: 'bg-[#0A66C2] hover:bg-[#084e96]',
    svgPath: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25a1.62 1.62 0 0 0-1.63 1.62 1.63 1.63 0 1 0 3.25 0c0-.9-.73-1.62-1.62-1.62Z',
  },
  {
    key: 'telegram',
    label: 'Telegram',
    href: process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM_URL || 'https://telegram.org',
    bgColor: 'bg-[#229ED9] hover:bg-[#1a85b8]',
    svgPath: 'm20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.67c.458 0 .66-.21.916-.458l2.199-2.138 4.573 3.378c.843.464 1.448.225 1.658-.785l2.997-14.113c.307-1.233-.472-1.792-1.506-1.521z',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    href: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP_URL || 'https://whatsapp.com',
    bgColor: 'bg-[#25D366] hover:bg-[#1eb857]',
    svgPath: 'M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29s-1.47-.73-1.7-.81c-.23-.09-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43-.14-.01-.3-.01-.47-.01Z',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL || 'https://instagram.com',
    bgColor: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95',
    svgPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL || 'https://facebook.com',
    bgColor: 'bg-[#1877F2] hover:bg-[#166fe5]',
    svgPath: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
] as const;

export function FollowUsWidget() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
          <Rss size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">Follow Us On Social Media</h3>
          <p className="mt-0.5 text-xs text-slate-500">Get Latest Update On Social Media</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 pt-1">
        {CHANNELS.map(({ key, label, href, bgColor, svgPath }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`flex h-11 w-11 flex-1 items-center justify-center rounded-xl text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${bgColor}`}
          >
            <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
              <path d={svgPath} />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
