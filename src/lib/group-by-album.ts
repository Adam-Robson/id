import type { SongMeta } from '@/types/song-meta';

export function groupByAlbum<T extends SongMeta>(
  songs: T[],
): Record<string, T[]> {
  return songs.reduce<Record<string, T[]>>((acc, song) => {
    if (!acc[song.album]) acc[song.album] = [];
    acc[song.album].push(song);
    return acc;
  }, {});
}
