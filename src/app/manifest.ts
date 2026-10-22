import type { MetadataRoute } from 'next';
import { BACKGROUND_COLOUR, THEME_COLOUR } from '@/lib/constants/app-colours';

/**
 * The web app manifest, served by Next at /manifest.webmanifest with its
 * <link> added to every page. Its PNG icons are static files in
 * public/favicon; Next has no file convention for manifest icons.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LE FOG',
    short_name: 'LE FOG',
    description: 'Website for LE FOG; Portland, Oregon, US',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: BACKGROUND_COLOUR,
    theme_color: THEME_COLOUR,
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/favicon/icon-192.png', type: 'image/png', sizes: '192x192' },
      { src: '/favicon/icon-512.png', type: 'image/png', sizes: '512x512' },
      {
        src: '/favicon/icon-maskable-512.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'maskable',
      },
    ],
  };
}
