import type { Metadata } from 'next';

/**
 * The card every page shares as, unless it has a better one of its own —
 * album pages swap in their cover art. Built from the about-page portraits
 * by `npm run og:build`; see scripts/build-og-image.mjs.
 *
 * One composited image rather than the three portraits listed separately:
 * scrapers pick a single image out of the list, so three entries would
 * gamble on which one a link shows, and a bare square crops badly into the
 * 1.91:1 slot every platform renders.
 */
export const sharedOgImage: NonNullable<Metadata['openGraph']>['images'] = [
  {
    url: '/images/og-image.jpg',
    type: 'image/jpeg',
    width: 1200,
    height: 630,
    alt: 'LE FOG — three portraits: a deer mask in teal, a sunlit morning with a coffee mug, and heart-shaped sunglasses under pink neon',
  },
];
