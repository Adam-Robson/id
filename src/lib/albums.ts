import { groupByAlbum } from "@/lib/group-by-album";
import type { AlbumMeta } from "@/types/album";
import type { Song } from "@/types/song";

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
export const ALBUM_META: Record<string, AlbumMeta> = {
  forbeforeiforget: {
    key: "forbeforeiforget",
    catalog: "LF-001",
    cover: "/images/albums/forbeforeiforget.webp",
    year: 2024,
    order: 1,
  },
  hifiveyourself: {
    key: "hifiveyourself",
    catalog: "LF-002",
    cover: "/images/albums/hifiveyourself.webp",
    year: 2026,
    order: 2,
  },
  leftstaticandatease: {
    key: "leftstaticandatease",
    catalog: "LF-003",
    cover: "/images/albums/leftstaticandatease.webp",
    year: 2020,
    order: 3,
  },
  seemsreal: {
    key: "seemsreal",
    catalog: "LF-004",
    cover: "/images/albums/seemsreal.webp",
    year: 2020,
    order: 4,
  },
  "three.": {
    key: "three.",
    catalog: "LF-005",
    cover: "/images/albums/three.webp",
    year: 2022,
    order: 5,
  },
};

const UNKNOWN_ALBUM_ORDER = 999;

export function metaFor(albumKey: string): AlbumMeta {
  return (
    ALBUM_META[albumKey] ?? {
      key: albumKey,
      catalog: "LF-???",
      order: UNKNOWN_ALBUM_ORDER,
    }
  );
}

export interface AlbumWithSongs {
  meta: AlbumMeta;
  songs: Song[];
}

/**
 * Groups songs by album and sorts albums newest release first. Albums
 * without a known year fall back to their manual `order`, and sort
 * after every dated album.
 */
export function orderedAlbums(songs: Song[]): AlbumWithSongs[] {
  return Object.entries(groupByAlbum(songs))
    .map(([key, albumSongs]) => ({ meta: metaFor(key), songs: albumSongs }))
    .sort((a, b) => {
      const { year: ay } = a.meta;
      const { year: by } = b.meta;
      if (ay != null && by != null) {
        if (ay !== by) return by - ay;
        return a.meta.order - b.meta.order;
      }
      if (ay != null) return -1;
      if (by != null) return 1;
      return a.meta.order - b.meta.order;
    });
}
