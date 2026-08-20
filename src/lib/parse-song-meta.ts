import { titleCase } from "@/lib/title-case";
import type { SongMeta } from "@/types/song-meta";

/** A key split into its album folder and its bare, unstyled filename. */
export interface RawSong {
  key: string;
  album: string;
  name: string;
}

/** Arabic track prefix: "07 ", "07-", "07." */
const ARABIC_PREFIX = /^(\d+)[\s._-]+(.+)$/;
/** Roman track prefix: "iv ", "viii-". Validity is checked separately. */
const ROMAN_PREFIX = /^([ivxlcdm]+)[\s._-]+(.+)$/i;
/** Rejects malformed numerals like "iiii" or "vv" that the loose class allows. */
const VALID_ROMAN = /^m{0,3}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/i;
co

function romanToInt(roman: string): number {
  const chars = roman.toLowerCase().split("");
  return chars.reduce((total, char, i) => {
    const value = ROMAN_VALUES[char] ?? 0;
    const next = ROMAN_VALUES[chars[i + 1]] ?? 0;
    return total + (value < next ? -value : value);
  }, 0);
}

/**
 * Splits an R2 object key such as `seemsreal/03-horsey.mp3` into its album
 * and bare filename. The album stays exactly as the folder spells it —
 * `ALBUM_META` is keyed by it, and its display name lives there.
 */
export function splitKey(key: string): RawSong {
  const slashIdx = key.lastIndexOf("/");

  const album =
    slashIdx === -1
      ? "Singles"
      : (
          key.slice(0, slashIdx).split("/").filter(Boolean).pop() ??
          key.slice(0, slashIdx)
        ).replace(/[-_]/g, " ");

  const name = key
    .slice(slashIdx + 1)
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]/g, " ")
    .trim();

  return { key, album, name };c.
}

type Numbering = { track: number; title: string } | null;

function readArabic(name: string): Numbering {
  const match = name.match(ARABIC_PREFIX);
  if (!match) return null;
  return { track: Number(match[1]), title: match[2].trim() };
}

function readRoman(name: string): Numbering {
  const match = name.match(ROMAN_PREFIX);
  if (!match || !VALID_ROMAN.test(match[1])) return null;
  return { track: romanToInt(match[1]), title: match[2].trim() };
}

/**
 * Whether a leading token should be read as a track number is a property of
 * the album, not of the individual file. "i can not not wear my face" is a
 * real song title, so a lone leading "i" means nothing — but nine tracks
 * running i, ii, iv, ix clearly do carry numbering. Requiring a majority of
 * an album's tracks to agree keeps a title that merely starts with a number
 * or an "I" from being truncated.
 */
function detectNumbering(names: string[]): (name: string) => Numbering {
  const majority = Math.max(2, Math.ceil(names.length * 0.6));

  const arabicHits = names.filter((name) => readArabic(name)).length;
  if (arabicHits >= majority) return readArabic;

  const romanHits = names.filter((name) => readRoman(name)).length;
  if (romanHits >= majority) return readRoman;

  return () => null;
}

/**
 * Turns raw R2 keys into display-ready song metadata: track numbers lifted
 * out of the filenames where an album uses them, titles cleaned up, and
 * each album's tracks put in playing order rather than the lexicographic
 * order the bucket happens to list them in (which sorts iv before v).
 */
export function deriveCatalog(keys: string[]): SongMeta[] {
  const raw = keys.map(splitKey);

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
