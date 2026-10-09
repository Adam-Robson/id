import type { Song } from '@/lib/types/song';
import type { SongMeta } from '@/lib/types/song-meta';
/**
 * Attaches the streaming endpoint to each track. The URL points at our own
 * route rather than at R2, so it never expires and playback can't break in a
 * tab that has been open a while — the route re-signs per request, after
 * re-checking access.
 */
export function toPlayableUrl(songs: SongMeta[]): Song[] {
  return songs.map((song) => ({
    ...song,
    url: `/api/stream?key=${encodeURIComponent(song.key)}`,
  }));
}
