import { AUDIO_EXTENSIONS } from '@/lib/constants/audio-extensions';
import { deriveCatalog } from '@/lib/db/r2/derive-catalog';
import { listAudioObjects } from '@/lib/db/r2/list-audio-objects';
import type { SongMeta } from '@/lib/types/song-meta';
import { orderedAlbumMeta } from '@/lib/utils/ordered-album-meta';

/**
 * Track metadata only — no signed URL. Safe to expose to any visitor,
 * signed in or not, since it grants no access to the underlying files.
 */
const ALBUM_KEYS = new Set(orderedAlbumMeta().map((album) => album.key));

export async function listSongs(): Promise<SongMeta[]> {
  const objects = await listAudioObjects();
  const audioKeys = objects
    .map(({ key }) => key)
    .filter((key) => AUDIO_EXTENSIONS.test(key));
  const songs = deriveCatalog(audioKeys);
  return songs.filter((song) => ALBUM_KEYS.has(song.album));
}
