import type { AlbumMeta } from '@/lib/types/album-meta';
import type { SongMeta } from '@/lib/types/song-meta';
/**
 * Represents an album along with its associated songs.
 * @template T - The type of the songs, defaults to `SongMeta`.
 * @property {AlbumMeta} meta - The metadata of the album.
 * @property {T[]} songs - The list of songs associated with the album.
 */
export interface AlbumWithSongs<T extends SongMeta = SongMeta> {
  meta: AlbumMeta;
  songs: T[];
}
