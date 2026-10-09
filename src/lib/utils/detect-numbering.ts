import type { SongTitle } from '@/lib/types/song-title';
import { readArabic } from '@/lib/utils/read-arabic';
import { readRoman } from '@/lib/utils/read-roman';
/**
 * Whether a leading token should be read as a track number is a property of
 * the album, not of the individual file. "i can not not wear my face" is a
 * real song title, so a lone leading "i" means nothing — but nine tracks
 * running i, ii, iv, ix clearly do carry numbering. Requiring a majority of
 * an album's tracks to agree keeps a title that merely starts with a number
 * or an "I" from being truncated.
 */
export function detectNumbering(names: string[]): (name: string) => SongTitle | null {
  const majority = Math.max(2, Math.ceil(names.length * 0.6));

  const arabicHits = names.filter((name) => readArabic(name)).length;
  if (arabicHits >= majority) return readArabic;

  const romanHits = names.filter((name) => readRoman(name)).length;
  if (romanHits >= majority) return readRoman;

  return () => null;
}
