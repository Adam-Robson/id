import { sharedOgImage } from '@/components/shared-og-image';
import { ARTIST_ID } from '@/lib/constants/artist-id';
import { SITE_URL } from '@/lib/constants/site-url';
import { orderedAlbumMeta } from '@/lib/utils/ordered-album-meta';
/**
 * Structured data for the site, generated from `ALBUM_META` so it can't
 * drift from what the shelf actually renders. Track counts are deliberately
 * omitted: R2 is the source of truth for those, and publishing a hardcoded
 * count that quietly goes stale is worse than publishing none at all.
 */
export default function JsonLd() {
  const albums = orderedAlbumMeta();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MusicGroup',
        '@id': ARTIST_ID,
        name: 'LE FOG',
        url: SITE_URL,
        image: sharedOgImage,
        genre: ['Electronic', 'Ambient', 'Rock', 'Folk', 'Psychedelic'],
        foundingLocation: {
          '@type': 'Place',
          name: 'Portland, Oregon, US',
        },
        album: albums.map((album) => ({ '@id': `${SITE_URL}/#${album.key}` })),
      },
      ...albums.map((album) => ({
        '@type': 'MusicAlbum',
        '@id': `${SITE_URL}/#${album.key}`,
        name: album.title,
        byArtist: { '@id': ARTIST_ID },
        ...(album.year ? { datePublished: String(album.year) } : {}),
        ...(album.cover ? { image: `${SITE_URL}${album.cover}` } : {}),
      })),
    ],
  };

  return (
    <script type='application/ld+json'>
      {JSON.stringify(jsonLd).replace(/</g, '\\u003c')}
    </script>
  );
}
