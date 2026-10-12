import { describe, expect, it } from 'vitest';
import { ALBUM_META } from '@/lib/constants/album-meta';
import type { AlbumMeta } from '@/lib/types/album-meta';
import { byRelease } from '@/lib/utils/by-release';
import { orderedAlbumMeta } from '@/lib/utils/ordered-album-meta';

const album = (key: string, order: number, year?: number): AlbumMeta => ({
  key,
  title: key,
  slug: key,
  catalog: `LF-${order}`,
  order,
  year,
});

describe('album order', () => {
  // The shelf reads newest first. Two albums came out in 2026 and two in
  // 2020; ties used to fall back to oldest-first, so each pair showed in
  // the wrong order. The catalog numbers count up with each release, so
  // newest first is simply the catalog numbers counting down.
  it('lists the discography newest release first', () => {
    const catalogs = orderedAlbumMeta().map((meta) => meta.catalog);
    const countingDown = Object.values(ALBUM_META)
      .map((meta) => meta.catalog)
      .sort()
      .reverse();
    expect(catalogs).toEqual(countingDown);
  });

  // Within a year, the later release is the newer one.
  it('puts the later release first when two share a year', () => {
    const earlier = album('earlier', 1, 2020);
    const later = album('later', 2, 2020);
    expect([earlier, later].sort(byRelease)).toEqual([later, earlier]);
  });

  // A year outranks the release sequence: an album from 2024 is newer than
  // one from 2020 whatever its order number says.
  it('sorts by year before release sequence', () => {
    const older = album('older', 9, 2020);
    const newer = album('newer', 1, 2024);
    expect([older, newer].sort(byRelease)).toEqual([newer, older]);
  });

  // An album found in the bucket but missing from ALBUM_META has no year;
  // it goes after every album we know about rather than jumping the shelf.
  it('puts albums without a year after every dated album', () => {
    const dated = album('dated', 1, 2020);
    const undated = album('undated', 999);
    expect([undated, dated].sort(byRelease)).toEqual([dated, undated]);
  });
});
