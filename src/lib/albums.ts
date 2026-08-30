import { groupByAlbum } from '@/lib/group-by-album';
import { titleCase } from '@/lib/title-case';
import type { AlbumMeta } from '@/types/album';
import type { SongMeta } from '@/types/song-meta';

/**
 * Presentation metadata for each album, keyed by the album name that
 * `parseSongMeta` derives from the R2 folder structure.
 *
 * R2 remains the source of truth for which albums and songs exist;
 * this module is the source of truth for how they present. An album
 * that exists in R2 but not here still renders — plainly, at the end
 * of the shelf — so adding a new album to the bucket never breaks
 * the homepage.
 *
 * TODO(adam): write each album's one-line blurb in your own voice.
 */
const ALBUM_META: Record<string, AlbumMeta> = {
  forbeforeiforget: {
    key: 'forbeforeiforget',
    title: 'For Before I Forget',
    slug: 'for-before-i-forget',
    catalog: 'LF-001',
    cover: '/images/albums/forbeforeiforget.webp',
    year: 2024,
    order: 1,
  },
  hifiveyourself: {
    key: 'hifiveyourself',
    title: 'Hi Five Yourself',
    slug: 'hi-five-yourself',
    catalog: 'LF-002',
    cover: '/images/albums/hifiveyourself.webp',
    year: 2026,
    order: 2,
  },
  leftstaticandatease: {
    key: 'leftstaticandatease',
    title: 'Left Static and at Ease',
    slug: 'left-static-and-at-ease',
    catalog: 'LF-003',
    cover: '/images/albums/leftstaticandatease.webp',
    year: 2020,
    order: 3,
  },
  seemsreal: {
    key: 'seemsreal',
    title: 'Seems Real',
    slug: 'seems-real',
    catalog: 'LF-004',
    cover: '/images/albums/seemsreal.webp',
    year: 2020,
    order: 4,
  },
  'three.': {
    key: 'three.',
    // Lowercase and the trailing period are deliberate.
    title: 'three.',
    slug: 'three',
    catalog: 'LF-005',
    cover: '/images/albums/three.webp',
    year: 2022,
    order: 5,
  },
};

const UNKNOWN_ALBUM_ORDER = 999;

/** URL-safe segment for an album that has no entry in `ALBUM_META`. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function metaFor(albumKey: string): AlbumMeta {
  return (
    ALBUM_META[albumKey] ?? {
      key: albumKey,
      title: titleCase(albumKey),
      slug: slugify(albumKey),
      catalog: 'LF-???',
      order: UNKNOWN_ALBUM_ORDER,
    }
  );
}

/**
 * Resolves a URL segment back to its album. Returns undefined for an
 * unknown slug so the route can render a 404 rather than an empty shelf.
 */
export function albumBySlug(slug: string): AlbumMeta | undefined {
  return Object.values(ALBUM_META).find((album) => album.slug === slug);
}

/**
 * Newest release first. Albums without a known year fall back to their
 * manual `order` and sort after every dated album.
 */
function byRelease(a: AlbumMeta, b: AlbumMeta): number {
  const { year: ay } = a;
  const { year: by } = b;
  if (ay != null && by != null) {
    if (ay !== by) return by - ay;
    return a.order - b.order;
  }
  if (ay != null) return -1;
  if (by != null) return 1;
  return a.order - b.order;
}

/**
 * Every known album in shelf order, independent of R2. Used where the
 * discography is listed but track data isn't needed — the homepage
 * discography and the JSON-LD graph — so neither pays for a bucket read.
 */
export function orderedAlbumMeta(): AlbumMeta[] {
  return Object.values(ALBUM_META).sort(byRelease);
}

export interface AlbumWithSongs<T extends SongMeta = SongMeta> {
  meta: AlbumMeta;
  songs: T[];
}

/** Groups songs by album and sorts albums newest release first. */
export function orderedAlbums<T extends SongMeta>(
  songs: T[],
): AlbumWithSongs<T>[] {
  return Object.entries(groupByAlbum(songs))
    .map(([key, albumSongs]) => ({ meta: metaFor(key), songs: albumSongs }))
    .sort((a, b) => byRelease(a.meta, b.meta));
}
