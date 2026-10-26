import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants/site-url';
/**
 * Metadata configuration for the LE FOG website. The manifest link is added
 * by Next from src/app/manifest.ts.
 */
export const PageMetadata: Metadata = {
  applicationName: 'LE FOG',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LE FOG',
    description:
      'LE FOG is the name of the band of Adam Robson since 2020 — a home recording artist based in Portland, Oregon.',
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
  },
};
