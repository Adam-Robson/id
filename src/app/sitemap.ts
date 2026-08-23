import type { MetadataRoute } from 'next';
import { orderedAlbumMeta } from '@/lib/albums';
import { albumLastModified } from '@/lib/r2';
import { SITE_URL } from '@/lib/site';

/**
 * Fallback date for pages whose content lives in the repo rather than in
 * R2. Bump when the copy on /about or /contact actually changes.
 */
const CONTENT_LAST_EDITED = new Date('2026-04-16');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Album pages date themselves from the tracks in the bucket, so uploading
  // a record is enough to tell crawlers the catalog moved.
  let lastModifiedByAlbum = new Map<string, Date>();
  try {
    lastModifiedByAlbum = await albumLastModified();
  } catch (error) {
    console.error('Sitemap: failed to read album timestamps from R2', error);
  }

  const albums = orderedAlbumMeta();
  const albumDates = albums
    .map((album) => lastModifiedByAlbum.get(album.key))
    .filter((date): date is Date => date != null);

  const catalogUpdated = albumDates.length
    ? new Date(Math.max(...albumDates.map((date) => date.getTime())))
    : CONTENT_LAST_EDITED;

  return [
    {
      url: SITE_URL,
      lastModified: catalogUpdated,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/albums`,
      lastModified: catalogUpdated,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...albums.map((album) => ({
      url: `${SITE_URL}/albums/${album.slug}`,
      lastModified: lastModifiedByAlbum.get(album.key) ?? catalogUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/about`,
      lastModified: CONTENT_LAST_EDITED,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: CONTENT_LAST_EDITED,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
