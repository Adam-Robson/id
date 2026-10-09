import type { Metadata } from 'next';

export const sharedOgImage: NonNullable<Metadata['openGraph']>['images'] = [{
  url: '/images/og-image.',
  type: 'image/webp',
  width: 1200,
  height: 630,
  alt: 'LE FOG - three portraits'
}];
