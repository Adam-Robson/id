import { listAudioObjects } from '@/lib/db/r2/list-audio-objects';
import { parseSongTitle } from '@/lib/utils/parse-song-title';
/**
 * When each track was last written to the bucket, keyed by album. Backs the
 * sitemap's `lastModified` so it reflects the catalog instead of a date
 * someone has to remember to bump.
 */
export async function albumLastModified(): Promise<Map<string, Date>> {
  const objects = await listAudioObjects();
  const newest = new Map<string, Date>();

  for (const { key, lastModified } of objects) {
    if (!lastModified) continue;
    const { album } = parseSongTitle(key);
    const current = newest.get(album);
    if (!current || lastModified > current) newest.set(album, lastModified);
  }

  return newest;
}
