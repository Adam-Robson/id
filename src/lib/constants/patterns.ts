import type { Pattern } from '@/lib/types/pattern';
import type { PatternKey } from '@/lib/types/pattern-key';

/**
 * Where each print lives and how it is captioned. The page plate reads
 * from here, so the image and its caption are defined in one place.
 */
export const PATTERNS: Record<PatternKey, Pattern> = {
  pastels: {
    key: 'pastels',
    src: '/images/pastels.webp',
    caption: 'Pastels — print',
  },
  'electric-pink': {
    key: 'electric-pink',
    src: '/images/electric_pink.webp',
    caption: 'Electric Pink — print',
  },
  poppies: {
    key: 'poppies',
    src: '/images/org_ppl_flowers.webp',
    caption: 'Poppies — print',
  },
  dahlias: {
    key: 'dahlias',
    src: '/images/maybe_dahlias.webp',
    caption: 'Dahlias — print',
  },
  peonies: {
    key: 'peonies',
    src: '/images/ppl_tqs_abstract.webp',
    caption: 'Peonies — print',
  },
  'little-flowers': {
    key: 'little-flowers',
    src: '/images/little_flowers.webp',
    caption: 'Little Flowers — print',
  },
};
