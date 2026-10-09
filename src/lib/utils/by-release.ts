import type { AlbumMeta } from '@/lib/types/album-meta';

/**
 * Newest release first. Albums without a known year fall back to their
 * manual `order` and sort after every dated album.
 */
export function byRelease(a: AlbumMeta, b: AlbumMeta): number {
  const { year: ay } = a;
  const { year: by } = b;
  if (ay != null && by != null) {
    if (ay !== by) return by - ay;
    return a.order - b.order;
  }
  if (ay != null) return -1;
  if (by != null) return 1;
  return a.order - b.order;
}
