import type { ResolvingMetadata } from 'next';
import { describe, expect, it, vi } from 'vitest';
import { generateMetadata as about } from '@/app/about/page';
import { generateMetadata as albums } from '@/app/albums/page';
import { generateMetadata as contact } from '@/app/contact/page';

// The albums page reads auth and storage when it renders; neither is needed
// to build its metadata, so they are stubbed rather than configured.
vi.mock('@/lib/auth/get-access-level', () => ({ getAccessLevel: vi.fn() }));
vi.mock('@/lib/db/r2/list-songs', () => ({ listSongs: vi.fn() }));

const shareImage = [
  {
    url: 'https://lefog.xyz/opengraph-image.jpg?opengraph-image.hash.jpg',
    width: 1200,
    height: 630,
  },
];

const parent = Promise.resolve({
  openGraph: { images: shareImage },
}) as unknown as ResolvingMetadata;

// Next replaces a parent's openGraph wholesale when a page sets its own, so
// a page with its own title and description drops the share image unless
// it passes the parent's along. That is how these three pages shipped with
// no link preview image while the home page had one.
describe('pages that set their own openGraph', () => {
  it.each([
    ['/about', about],
    ['/albums', albums],
    ['/contact', contact],
  ])('%s keeps the share image from the root', async (_route, generate) => {
    const { openGraph } = await generate({}, parent);
    expect(openGraph?.images).toEqual(shareImage);
  });
});
