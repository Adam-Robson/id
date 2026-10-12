import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { body, framed, orbOnly } from './parse-logo.mjs';
import { COLOURWAYS, ORB_FRAME, OUT, PAPER, sourceFile } from './sources.mjs';

/** Rendered width of each orb: about three times its size in the header. */
const ORB_PX = 192;

/**
 * One colourway's orb, rendered into the shared frame.
 */
export async function renderOrb(name, px, format = 'png') {
  const svg = await readFile(sourceFile(name), 'utf8');
  const masked = Buffer.from(framed(body(orbOnly(svg)), ORB_FRAME, px));

  const outline = await sharp(masked)
    .extractChannel('alpha')
    .threshold(8)
    .blur(0.6)
    .toBuffer();

  const image = sharp(masked)
    .flatten({ background: PAPER })
    .joinChannel(outline);

  return format === 'webp'
    ? image.webp({ quality: 86, alphaQuality: 90 }).toBuffer()
    : image.png().toBuffer();
}

/** Writes orb-<colourway>.webp for every colourway. */
export async function buildOrbs() {
  return Promise.all(
    COLOURWAYS.map(async (name) => {
      const file = path.join(OUT.logoDir, `orb-${name}.webp`);
      const info = await sharp(await renderOrb(name, ORB_PX, 'webp')).toFile(
        file,
      );
      return `orb-${name}.webp  ${(info.size / 1024).toFixed(1)}KB`;
    }),
  );
}
