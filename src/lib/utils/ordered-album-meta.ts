import { ALBUM_META } from '@/lib/constants/album-meta';
import type { AlbumMeta } from '@/lib/types/album-meta';
import { byRelease } from '@/lib/utils/by-release';
/**
 * Every known album in shelf order, independent of R2. Used where the
 * discography is listed but track data isn't needed — the homepage
 * discography and the JSON-LD graph — so neither pays for a bucket read.
 */
export function orderedAlbumMeta(): AlbumMeta[] {
  return Object.values(ALBUM_META).sort(byRelease);
}
