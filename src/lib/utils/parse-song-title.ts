import type { RawSong } from '@/lib/types/raw-song';
/**
 * Splits an R2 object key such as `seemsreal/03-horsey.mp3` into its album
 * and bare filename. The album stays exactly as the folder spells it —
 * `ALBUM_META` is keyed by it, and its display name lives there.
 */
export function parseSongTitle(key: string): RawSong {
  const slashIdx = key.lastIndexOf('/');

  const album =
    slashIdx === -1
      ? 'Singles'
      : (
          key.slice(0, slashIdx).split('/').filter(Boolean).pop() ??
          key.slice(0, slashIdx)
        ).replace(/[-_]/g, ' ');

  const name = key
    .slice(slashIdx + 1)
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .trim();

  return { key, album, name };
}

