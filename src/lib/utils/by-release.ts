import type { AlbumMeta } from '@/lib/types/album-meta';

/**
 * Newest release first. Albums from the same year fall back to `order`,
 * which counts up with each release, so the higher number is the newer
 * album and comes first. Albums without a known year sort after every dated
 * album, in the same newest-first order.
 */
export function byRelease(a: AlbumMeta, b: AlbumMeta): number {
  const { year: ay } = a;
  const { year: by } = b;
  if (ay != null && by != null && ay !== by) return by - ay;
  if (ay != null && by == null) return -1;
  if (ay == null && by != null) return 1;
  return b.order - a.order;
}
