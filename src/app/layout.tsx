import type { Metadata } from 'next';
import { inter, sourceSerif } from '@/lib/fonts';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { organizationJsonLd } from '@/lib/seo/jsonld';
import { SITE } from '@/lib/seo/metadata';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { getCurrentUser } from '@/lib/auth/session';
import { GoogleAdSenseScript } from '@/components/ads/GoogleAdSenseScript';
import { ConsentBanner } from '@/components/ads/ConsentBanner';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: 'Thoughtful writing on the things worth thinking about.',
  openGraph: { type: 'website', siteName: SITE.name, url: SITE.url },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="flex min-h-screen flex-col">
        <GoogleAdSenseScript />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <AuthProvider initialUser={user}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        <ConsentBanner />
      </body>
    </html>
  );
}
