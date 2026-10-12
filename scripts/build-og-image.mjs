/**
 * Build the Open Graph card: the dahlias print beside the wordmark.
 *
 * The card is a committed asset rather than something rendered per request.
 * Rerun when the photo or the logo changes: npm run og:build
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { LOGO_GEOMETRY } from '../src/lib/constants/logo-geometry.ts';
import { LOGO_ORBS } from '../src/lib/constants/logo-orbs.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public/images/og-image.webp');

const W = 1200;
const H = 630;

/* from globals.css: --ink and --paper. */
const INK = '#2e2a26';
const PAPER = '#f6f2e9';

/** The photo fills a square on the left, inset by MARGIN on three sides. */
const MARGIN = 50;
const FRAME = H - 2 * MARGIN;
const RADIUS = 18;

const PHOTO = 'maybe_dahlias';

/** Wordmark height; it is centred in the space right of the photo. */
const MARK_HEIGHT = 120;

/** Rounds an image's corners by masking it with a rounded rectangle. */
async function roundedFrame(file) {
  const mask = Buffer.from(
    `<svg width="${FRAME}" height="${FRAME}"><rect width="${FRAME}" height="${FRAME}" rx="${RADIUS}" ry="${RADIUS}" fill="#fff"/></svg>`,
  );

  return sharp(file)
    .resize(FRAME, FRAME, { fit: 'cover', position: 'attention' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

/**
 * The lettering is a shape only, so it is painted paper-coloured to read on
 * the ink ground; the primary orb then sits beneath it, as on the site.
 */
async function wordmark(height) {
  const shape = await sharp(path.join(ROOT, 'public/images/logo/wordmark.svg'))
    .resize({ height })
    .toBuffer();

  const { width } = await sharp(shape).metadata();
  const at = (pct, of) => Math.round((Number.parseFloat(pct) / 100) * of);
  const { orb } = LOGO_GEOMETRY;

  const letters = await sharp({
    create: { width, height, channels: 4, background: PAPER },
  })
    .composite([{ input: shape, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const painted = await sharp(
    path.join(ROOT, `public/images/logo/orb-${LOGO_ORBS[0]}.webp`),
  )
    .resize(at(orb.width, width), at(orb.height, height))
    .toBuffer();

  return {
    width,
    buffer: await sharp({
      create: { width, height, channels: 4, background: '#0000' },
    })
      .composite([
        { input: painted, left: at(orb.left, width), top: at(orb.top, height) },
        { input: letters },
      ])
      .png()
      .toBuffer(),
  };
}

const mark = await wordmark(MARK_HEIGHT);
const markArea = { left: MARGIN + FRAME, width: W - (MARGIN + FRAME) };

const layers = [
  {
    input: await roundedFrame(path.join(ROOT, `public/images/${PHOTO}.webp`)),
    left: MARGIN,
    top: MARGIN,
  },
  {
    input: mark.buffer,
    left: markArea.left + Math.round((markArea.width - mark.width) / 2),
    top: Math.round((H - MARK_HEIGHT) / 2),
  },
];

await mkdir(path.dirname(OUT), { recursive: true });
const info = await sharp({
  create: { width: W, height: H, channels: 3, background: INK },
})
  .composite(layers)
  .webp({ quality: 88, smartSubsample: true })
  .toFile(OUT);

console.log(
  `og-image.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`,
);
