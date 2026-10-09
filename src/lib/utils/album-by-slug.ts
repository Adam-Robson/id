import { ALBUM_META } from '@/lib/constants/album-meta';
import type { AlbumMeta } from '@/lib/types/album-meta';
/**
 * Resolves a URL segment back to its album. Returns undefined for an
 * unknown slug so the route can render a 404 rather than an empty shelf.
 */
export function albumBySlug(slug: string): AlbumMeta | undefined {
  return Object.values(ALBUM_META).find((album) => album.slug === slug);
}
