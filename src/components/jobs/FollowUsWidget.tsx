import { MessageCircle, Send, Instagram, Linkedin } from 'lucide-react';

/**
 * "Follow Us" widget — colored pill buttons per channel, matching the
 * jobcode.in sidebar. Links are read from env so this stays configurable
 * per-deployment without a code change; a channel is hidden entirely if its
 * URL isn't set rather than rendering a dead '#' link.
 */
const CHANNELS = [
  {
    key: 'whatsapp',
    label: 'Join WhatsApp',
    href: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP_URL,
    icon: MessageCircle,
    className: 'bg-emerald-500 hover:bg-emerald-600',
  },
  {
    key: 'telegram',
    label: 'Join Telegram',
    href: process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM_URL,
    icon: Send,
    className: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL,
    icon: Instagram,
    className: 'bg-pink-600 hover:bg-pink-700',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL,
    icon: Linkedin,
    className: 'bg-ink-950 hover:bg-ink-900',
  },
] as const;

export function FollowUsWidget() {
  const channels = CHANNELS.filter((c) => c.href);
  if (channels.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-brand-600">Follow Us</h3>
      <div className="flex flex-col gap-2.5">
        {channels.map(({ key, label, href, icon: Icon, className }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition ${className}`}
          >
            <Icon size={16} /> {label}
          </a>
        ))}
      </div>
    </div>
  );
}
