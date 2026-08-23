import { ClerkProvider } from '@clerk/nextjs';
import { ui } from '@clerk/ui';
import { Analytics } from '@vercel/analytics/next';
import { Barlow, Fraunces } from 'next/font/google';

import { cookies } from 'next/headers';
import './globals.css';
import type { Metadata, Viewport } from 'next';
import JsonLd from '@/app/components/json-ld';
import { sharedOgImage } from '@/app/components/shared-metadata';
import SignInPrompt from '@/app/components/sign-in-prompt';
import GlobalProvider from '@/contexts/global-provider';
import { getAccessLevel } from '@/lib/auth';
import { clerkAppearance } from '@/lib/clerk-appearance';
import { SITE_URL } from '@/lib/site';
import type { Theme } from '@/types/theme';

export const viewport: Viewport = {
  themeColor: '#272320',
  width: 'device-width',
  initialScale: 1,
};

const barlow = Barlow({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-barlow',
  weight: ['300', '400', '500', '600', '700'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
});

export const metadata: Metadata = {
  applicationName: 'LE FOG',
  manifest: '/manifest.json',
  title: {
    default: 'LE FOG',
    template: '%s — LE FOG',
  },
  description: 'Website for LE FOG; Portland, Oregon, US',
  generator: 'none',
  referrer: 'no-referrer',
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  appleWebApp: {
    title: 'LE FOG',
    capable: true,
    statusBarStyle: 'black',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon-128.png', sizes: '128x128', type: 'image/png' },
      {
        url: '/favicon/favicon-196x196.png',
        sizes: '196x196',
        type: 'image/png',
      },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon-57x57.png', sizes: '57x57' },
      { url: '/favicon/apple-touch-icon-60x60.png', sizes: '60x60' },
      { url: '/favicon/apple-touch-icon-72x72.png', sizes: '72x72' },
      { url: '/favicon/apple-touch-icon-76x76.png', sizes: '76x76' },
      { url: '/favicon/apple-touch-icon-114x114.png', sizes: '114x114' },
      { url: '/favicon/apple-touch-icon-120x120.png', sizes: '120x120' },
      { url: '/favicon/apple-touch-icon-144x144.png', sizes: '144x144' },
      { url: '/favicon/apple-touch-icon-152x152.png', sizes: '152x152' },
    ],
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    type: 'website',
    siteName: 'LE FOG',
    title: 'HOME | LE FOG',
    description:
      'LE FOG is the name of the band of Adam Robson since 2020 — a home recording artist based in Portland, Oregon.',
    url: `${SITE_URL}/`,
    locale: 'en_US',
    images: sharedOgImage,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LE FOG',
    description:
      'LE FOG is the name of the band of Adam Robson since 2020 — a home recording artist based in Portland, Oregon.',
    images: sharedOgImage,
  },
  other: {
    // Geo tags
    icbm: '45.5152, -122.6784',
    'geo.position': '45.5152;-122.6784',
    'geo.region': 'US-OR',
    'geo.placename': 'Portland, Oregon',
    // Content classification
    subject: 'LE FOG',
    rating: 'general',
    // MS Application tiles
    'msapplication-TileColor': '#333333ff',
    'msapplication-square70x70logo': '/favicon/mstile-70x70.png',
    'msapplication-TileImage': '/favicon/mstile-144x144.png',
    'msapplication-square150x150logo': '/favicon/mstile-150x150.png',
    'msapplication-wide310x150logo': '/favicon/mstile-310x150.png',
    'msapplication-square310x310logo': '/favicon/mstile-310x310.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = (cookieStore.get('theme')?.value ?? 'system') as Theme;
  const accessLevel = await getAccessLevel();

  return (
    <html
      lang='en'
      className={theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : ''}
    >
      <head>
        {/* DNS prefetch is not available via Metadata API */}
        <meta httpEquiv='x-dns-prefetch-control' content='off' />
        <link rel='dns-prefetch' href='//lefog.xyz/' />
        <link rel='preconnect' href='https://lefog.xyz/' />
        <JsonLd />
      </head>
      <body className={`antialiased ${barlow.variable} ${fraunces.variable}`}>
        <ClerkProvider appearance={clerkAppearance} ui={ui}>
          <GlobalProvider>
            {children}
            {/* Every page gets a way in. Resolved on the server so the bar
                never flashes in after hydration; the component itself opts
                out on the auth routes. */}
            {accessLevel === 'guest' && <SignInPrompt />}
            <Analytics />
          </GlobalProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
