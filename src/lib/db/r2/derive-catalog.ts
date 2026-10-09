import type { SongMeta } from '@/lib/types/song-meta';
import { parseSongTitle } from '@/lib/utils/parse-song-title';
import type { RawSong } from '@/lib/types/raw-song';
import { detectNumbering } from '@/lib/utils/detect-numbering';
import { titleCase } from '@/lib/utils/title-case';

/**
 * Turns raw R2 keys into display-ready song metadata: track numbers lifted
 * out of the filenames where an album uses them, titles cleaned up, and
 * each album's tracks put in playing order rather than the lexicographic
 * order the bucket happens to list them in (which sorts iv before v).
 */
export function deriveCatalog(keys: string[]): SongMeta[] {
  const raw = keys.map(parseSongTitle);

  const byAlbum = new Map<string, RawSong[]>();
  for (const song of raw) {
    const bucket = byAlbum.get(song.album);
    if (bucket) bucket.push(song);
    else byAlbum.set(song.album, [song]);
  }

  const catalog: SongMeta[] = [];

  for (const [album, songs] of byAlbum) {
    const read = detectNumbering(songs.map((song) => song.name));

    const parsed = songs.map((song) => {
      const numbering = read(song.name);
      return {
        key: song.key,
        album,
        title: titleCase(numbering?.title || song.name),
        track: numbering?.track,
      };
    });

    parsed.sort((a, b) => {
      if (a.track != null && b.track != null) return a.track - b.track;
      if (a.track != null) return -1;
      if (b.track != null) return 1;
      return a.key.localeCompare(b.key);
    });

    catalog.push(...parsed);
  }

  return catalog;
}
