import type { SongMeta } from '@/lib/types/song-meta';
/**
 * Represents a song with its metadata and a URL to access the audio file.
 */
export interface Song extends SongMeta {
  url: string;
}
