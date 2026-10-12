import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { renderOrb } from './build-orbs.mjs';
import { inkBox, square, union } from './measure.mjs';
import { framed, glyphGroups } from './parse-logo.mjs';
import {
  GLYPH_INK,
  ORB_FRAME,
  OUT,
  PAPER,
  PRIMARY,
  RING_GLYPH,
  sourceFile,
} from './sources.mjs';
import { writeIco } from './write-ico.mjs';

const FAVICONS = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['favicon-96x96.png', 96],
  ['favicon-128.png', 128],
  ['favicon-196x196.png', 196],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];

/**
 * Android crops maskable icons to a circle or squircle and promises only the
 * centre 80% survives, so the mark sits at 60% on a paper ground.
 */
const MASKABLE_SIZES = [192, 512];

const TOUCH_SIZES = [57, 60, 72, 76, 114, 120, 144, 152];

const TILES = [
  ['mstile-70x70.png', 70, 70],
  ['mstile-144x144.png', 144, 144],
  ['mstile-150x150.png', 150, 150],
  ['mstile-310x310.png', 310, 310],
  ['mstile-310x150.png', 310, 150],
];

/**
 * The icon is the logo's "O": the orb inside its hand-drawn ring. The full
 * wordmark is unreadable at tab size; the orb is the part people remember.
 */
async function markParts() {
  const svg = await readFile(sourceFile(PRIMARY), 'utf8');
  const ring = glyphGroups(svg)[RING_GLYPH];
  const frame = square(union(await inkBox(ring), ORB_FRAME), 0.04);
  return { ring, frame, markup: (await orbImage(512)) + ring };
}

/** The solid orb as an <image> in source units, sharp enough at `px`. */
async function orbImage(px) {
  const orb = (await renderOrb(PRIMARY, px)).toString('base64');
  const { x, y, w, h } = ORB_FRAME;
  return `<image x="${x}" y="${y}" width="${w}" height="${h}" href="data:image/png;base64,${orb}"/>`;
}

const renderMark = ({ markup, frame }, px) =>
  sharp(Buffer.from(framed(markup, frame, px)))
    .png()
    .toBuffer();

/** The mark centred on paper, for platforms that show no transparency. */
async function onPaper(parts, width, height, fill) {
  const px = Math.round(Math.min(width, height) * fill);
  return sharp({
    create: { width, height, channels: 4, background: PAPER },
  })
    .composite([{ input: await renderMark(parts, px), gravity: 'centre' }])
    .png()
    .toBuffer();
}

/**
 * The SVG favicon embeds the orb as a small PNG and keeps the ring as a
 * path, so the ring can switch to light ink when the browser is in dark mode.
 */
async function svgIcon({ ring, frame }) {
  const style =
    '<style>.ink{fill:#272727}@media (prefers-color-scheme:dark){.ink{fill:#ebe8e2}}</style>';
  const image = await orbImage(128);
  const inked = ring.replace(`fill="${GLYPH_INK}"`, 'class="ink"');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame.x} ${frame.y} ${frame.w} ${frame.h}">${style}${image}${inked}</svg>`;
}

export async function buildIcons() {
  const parts = await markParts();
  const out = (file) => path.join(OUT.faviconDir, file);
  const written = [];

  for (const [file, px] of FAVICONS) {
    await writeFile(out(file), await renderMark(parts, px));
    written.push(file);
  }

  for (const px of TOUCH_SIZES) {
    const file = `apple-touch-icon-${px}x${px}.png`;
    await writeFile(out(file), await onPaper(parts, px, px, 0.8));
    written.push(file);
  }

  for (const px of MASKABLE_SIZES) {
    const file = `icon-maskable-${px}.png`;
    await writeFile(out(file), await onPaper(parts, px, px, 0.6));
    written.push(file);
  }

  for (const [file, width, height] of TILES) {
    await writeFile(out(file), await onPaper(parts, width, height, 0.6));
    written.push(file);
  }

  await writeFile(
    path.join(OUT.appDir, 'apple-icon.png'),
    await onPaper(parts, 180, 180, 0.8),
  );
  await writeFile(path.join(OUT.appDir, 'icon.svg'), await svgIcon(parts));

  const ico = await Promise.all(
    [16, 32, 48].map(async (size) => ({
      size,
      png: await renderMark(parts, size),
    })),
  );
  await writeFile(path.join(OUT.appDir, 'favicon.ico'), writeIco(ico));

  return [...written, 'apple-icon.png', 'icon.svg', 'favicon.ico'];
}
