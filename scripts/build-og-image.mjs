/**
 * Builds the site's Open Graph card from the three about-page portraits.
 *
 * The card is a committed asset rather than something rendered per request:
 * social scrapers fetch it cold, often with a short timeout, and there is no
 * reason to pay for compositing on every crawl. Re-run this whenever the
 * portraits or the wordmark change:
 *
 *   npm run og:build
 *
 * Layout mirrors the about page — the wordmark over a triptych hung by hand,
 * ordered cool -> warm -> hot, with the middle frame sitting lower than its
 * neighbours.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public/images/og-image.jpg');

/** 1200x630 is the size every major scraper crops to. */
const W = 1200;
const H = 630;

/* Straight from globals.css: --ink and --paper. */
const INK = '#2e2a26';
const PAPER = '#f6f2e9';

const FRAME = 330;
const GAP = 26;
const RADIUS = 18;
/** The middle frame hangs lower, as it does on the about page. */
const DROP = 16;

const PORTRAITS = ['facedeer', 'coffeecup', 'facestars'];

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
 * The wordmark ships as dark ink on transparency, so it would vanish against
 * the ink ground. Repaint it by filling a paper-coloured block and keeping
 * only the pixels the mark itself covers.
 */
async function wordmark(height) {
  const shape = await sharp(path.join(ROOT, 'public/images/logo.svg'), {
    density: 400,
  })
    .trim()
    .resize({ height })
    .toBuffer();

  const { width } = await sharp(shape).metadata();

  return {
    width,
    buffer: await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: PAPER,
      },
    })
      .composite([{ input: shape, blend: 'dest-in' }])
      .png()
      .toBuffer(),
  };
}

const row = PORTRAITS.length * FRAME + (PORTRAITS.length - 1) * GAP;
const rowLeft = Math.round((W - row) / 2);
const rowTop = 224;

const mark = await wordmark(104);

const layers = [
  {
    input: mark.buffer,
    left: Math.round((W - mark.width) / 2),
    top: 62,
  },
  ...(await Promise.all(
    PORTRAITS.map(async (name, i) => ({
      input: await roundedFrame(path.join(ROOT, `public/images/${name}.webp`)),
      left: rowLeft + i * (FRAME + GAP),
      top: rowTop + (i === 1 ? DROP : 0),
    })),
  )),
];

await mkdir(path.dirname(OUT), { recursive: true });
const info = await sharp({
  create: { width: W, height: H, channels: 3, background: INK },
})
  .composite(layers)
  .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
  .toFile(OUT);

console.log(
  `og-image.jpg  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`,
);
