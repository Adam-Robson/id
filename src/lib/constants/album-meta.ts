import type { AlbumMeta } from '@/lib/types/album-meta';

/**
 * Presentation metadata for each album, keyed by the album name that
 * `parseSongMeta` derives from the R2 folder structure.
 *
 * R2 is the source of truth for which albums & songs exist;
 * this module is the source of truth for how they present.
 * An album that exists in R2 but not here still renders —
 * at the end of the shelf; adding a new album to the bucket
 * will not break the homepage.
 */
export const ALBUM_META: Record<string, AlbumMeta> = {
  deardakota: {
    key: 'deardakota',
    title: 'Dear Dakota',
    slug: 'dear-dakota',
    catalog: 'LF-006',
    cover: '/images/albums/deardakota.webp',
    year: 2026,
    order: 6,
  },
  hifiveyourself: {
    key: 'hifiveyourself',
    title: 'Hi Five Yourself',
    slug: 'hi-five-yourself',
    catalog: 'LF-005',
    cover: '/images/albums/hifiveyourself.webp',
    year: 2026,
    order: 5,
  },
  forbeforeiforget: {
    key: 'forbeforeiforget',
    title: 'For Before I Forget',
    slug: 'for-before-i-forget',
    catalog: 'LF-004',
    cover: '/images/albums/forbeforeiforget.webp',
    year: 2024,
    order: 4,
  },
  'three.': {
    key: 'three.',
    // Lowercase and the trailing period are deliberate.
    title: 'three.',
    slug: 'three',
    catalog: 'LF-003',
    cover: '/images/albums/three.webp',
    year: 2022,
    order: 3,
  },
  seemsreal: {
    key: 'seemsreal',
    title: 'Seems Real',
    slug: 'seems-real',
    catalog: 'LF-002',
    cover: '/images/albums/seemsreal.webp',
    year: 2020,
    order: 2,
  },
  leftstaticandatease: {
    key: 'leftstaticandatease',
    title: 'Left Static and at Ease',
    slug: 'left-static-and-at-ease',
    catalog: 'LF-001',
    cover: '/images/albums/leftstaticandatease.webp',
    year: 2020,
    order: 1,
  },
};
