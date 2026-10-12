/**
 * The orb colourways built by `npm run logo:build`, primary first. The
 * primary is the one shown whenever the logo is not cycling.
 */
export const LOGO_ORBS = [
  'tennisball',
  'grey-green',
  'turquoise',
  'lilac',
  'bruise',
] as const;

/** Pixel size of each orb-<colourway>.webp, for the image's intrinsic size. */
export const LOGO_ORB_SIZE = { width: 192, height: 195 } as const;
