import { ARABIC_PREFIX } from '@/lib/constants/number-parsing';
import type { SongTitle } from '@/lib/types/song-title';

/**
 * Reads an Arabic-numbered track from a song title.
 *
 * @param name The name of the song.
 * @returns The track number and title, or null if the name does not match the expected format.
 */
export function readArabic(name: string): SongTitle | null {
  const match = name.match(ARABIC_PREFIX);
  if (!match) return null;
  return { track: Number(match[1]), title: match[2].trim() };
}
