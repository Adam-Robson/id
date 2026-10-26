import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import manifest from '@/app/manifest';

const root = path.resolve(import.meta.dirname, '../..');

/**
 * Where a public URL is served from: public/ for static files, src/app for
 * Next's file-convention icons such as /icon.svg.
 */
const ships = (url: string) =>
  existsSync(path.join(root, 'public', url)) ||
  existsSync(path.join(root, 'src/app', url));

// Metadata only names files; nothing fails when one is missing. Browsers and
// link-preview crawlers quietly get a 404, which is how a share image with no
// file extension and a manifest that didn't exist both went unnoticed.
describe('assets named in metadata', () => {
  // Next writes the og:image and twitter:image tags, alt text included, only
  // when these files sit in src/app; without them shared links fall back to a
  // bare text preview, and nothing errors.
  const shareImage = ['opengraph-image.jpg', 'opengraph-image.alt.txt'];
  it.each(shareImage)(
    'keeps the share image file %s where Next looks for it',
    (file) => {
      expect(existsSync(path.join(root, 'src/app', file))).toBe(true);
    },
  );

  it.each(manifest().icons?.map((icon) => icon.src) ?? [])(
    'ships the manifest icon %s',
    (src) => {
      expect(ships(src)).toBe(true);
    },
  );

  // Next writes the link tags for these only when the file sits in src/app;
  // renaming or deleting one drops its tag, in silence, which leaves
  // browser tabs and iOS home screens to fall back to a blank default.
  const conventionIcons = ['favicon.ico', 'icon.svg', 'apple-icon.png'];
  it.each(conventionIcons)(
    'keeps the icon %s where Next looks for it',
    (file) => {
      expect(existsSync(path.join(root, 'src/app', file))).toBe(true);
    },
  );

  // Chrome only offers to install a site whose manifest has 192px and 512px
  // icons; without them the manifest is served but does nothing.
  it('lists the icon sizes Chrome needs to offer install', () => {
    const sizes = manifest().icons?.map((icon) => icon.sizes) ?? [];
    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
  });
});
