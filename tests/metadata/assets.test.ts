import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import manifest from '@/app/manifest';
import { PageMetadata } from '@/app/metadata';
import { sharedOgImage } from '@/components/shared-og-image';

const root = path.resolve(__dirname, '../..');

/**
 * Where a public URL is served from: public/ for static files, src/app for
 * Next's file-convention icons such as /icon.svg.
 */
const ships = (url: string) =>
  existsSync(path.join(root, 'public', url)) ||
  existsSync(path.join(root, 'src/app', url));

const urlsOf = (images: unknown): string[] =>
  (Array.isArray(images) ? images : [images]).map((image) =>
    typeof image === 'string' ? image : String(image.url),
  );

// Metadata only names files; nothing fails when one is missing. Browsers and
// link-preview crawlers quietly get a 404, which is how a share image with no
// file extension and a manifest that didn't exist both went unnoticed.
describe('assets named in metadata', () => {
  it.each(urlsOf(sharedOgImage))('ships the share image %s', (url) => {
    expect(ships(url)).toBe(true);
  });

  it.each(manifest().icons?.map((icon) => icon.src) ?? [])(
    'ships the manifest icon %s',
    (src) => {
      expect(ships(src)).toBe(true);
    },
  );

  const { icon, apple } = PageMetadata.icons as {
    icon: unknown;
    apple: unknown;
  };
  it.each([...urlsOf(icon), ...urlsOf(apple)])('ships the icon %s', (url) => {
    expect(ships(url)).toBe(true);
  });

  const tiles = Object.entries(PageMetadata.other ?? {})
    .filter(
      ([name]) =>
        name.startsWith('msapplication-') && name !== 'msapplication-TileColor',
    )
    .map(([, url]) => String(url));
  it.each(tiles)('ships the Windows tile %s', (url) => {
    expect(ships(url)).toBe(true);
  });

  // Chrome only offers to install a site whose manifest has 192px and 512px
  // icons; without them the manifest is served but does nothing.
  it('lists the icon sizes Chrome needs to offer install', () => {
    const sizes = manifest().icons?.map((icon) => icon.sizes) ?? [];
    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
  });
});
