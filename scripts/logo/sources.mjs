import path from 'node:path';

export const ROOT = path.resolve(import.meta.dirname, '../..');

/** Designer exports: identical lettering, one watercolour orb each. */
export const SOURCE_DIR = path.join(ROOT, 'assets/logo');

/** The first colourway is the brand's primary mark. */
export const COLOURWAYS = [
  'tennisball',
  'grey-green',
  'turquoise',
  'lilac',
  'bruise',
];

export const PRIMARY = COLOURWAYS[0];

export const sourceFile = (name) => path.join(SOURCE_DIR, `le-fog-${name}.svg`);

/** Lettering is drawn in this ink in every export. */
export const GLYPH_INK = '#272727';

/** Index of the "O" ring among the glyph groups: L, E, F, O, G. */
export const RING_GLYPH = 3;

/**
 * One frame, in source units, that holds every colourway's orb. The exports
 * place their orbs a few units apart, so rendering each into the same frame
 * keeps every orb exactly where its own file put it.
 */
export const ORB_FRAME = { x: 740, y: 585, w: 321, h: 326 };

export const PAPER = '#f6f4ef';

export const OUT = {
  logoDir: path.join(ROOT, 'public/images/logo'),
  faviconDir: path.join(ROOT, 'public/favicon'),
  appDir: path.join(ROOT, 'src/app'),
  geometry: path.join(ROOT, 'src/lib/constants/logo-geometry.ts'),
};
