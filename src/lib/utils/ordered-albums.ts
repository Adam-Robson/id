import type { AlbumWithSongs } from '@/lib/types/album-with-songs';
import type { SongMeta } from '@/lib/types/song-meta';
import { byRelease } from '@/lib/utils/by-release';
import { groupByAlbum } from '@/lib/utils/group-by-album';
import { metaFor } from '@/lib/utils/meta-for';

/** Groups songs by album and sorts albums newest release first. */
export function orderedAlbums<T extends SongMeta>(
  songs: T[],
): AlbumWithSongs<T>[] {
  return Object.entries(groupByAlbum(songs))
    .map(([key, albumSongs]) => ({ meta: metaFor(key), songs: albumSongs }))
    .sort((a, b) => byRelease(a.meta, b.meta));
}
