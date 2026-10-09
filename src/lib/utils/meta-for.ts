import { ALBUM_META } from '@/lib/constants/album-meta';
import type { AlbumMeta } from '@/lib/types/album-meta';
import { UNKNOWN_ALBUM_ORDER } from '../constants/unknown-album-order';
import { slugify } from './slugify';
import { titleCase } from './title-case';
/**
 * Retrieves the metadata for a given album key. If the album key does not exist in the predefined album metadata, it returns a default metadata object.
 * @param albumKey
 * @returns
 */
export function metaFor(albumKey: string): AlbumMeta {
  return (
    ALBUM_META[albumKey] ?? {
      key: albumKey,
      title: titleCase(albumKey),
      slug: slugify(albumKey),
      catalog: 'LF-???',
      order: UNKNOWN_ALBUM_ORDER,
    }
  );
}
