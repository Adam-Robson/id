import { ROMAN_NUMERALS, ROMAN_PREFIX } from '@/lib/constants/number-parsing';
import type { SongTitle } from '@/lib/types/song-title';
import { romanToInt } from '@/lib/utils/roman-to-int';
/**
 * Reads a Roman-numbered track from a song title.
 *
 * @param name The name of the song.
 * @returns The track number and title, or null if the name does not match the expected format.e
 */
export function readRoman(name: string): SongTitle | null {
  const match = name.match(ROMAN_PREFIX);
  if (!match || !ROMAN_NUMERALS.test(match[1])) return null;
  return { track: romanToInt(match[1]), title: match[2].trim() };
}
