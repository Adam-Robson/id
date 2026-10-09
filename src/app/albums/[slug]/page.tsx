import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AlbumTracks from '@/components/album-tracks';
import SiteHeader from '@/components/site-header';
import { getAccessLevel } from '@/lib/auth/get-access-level';
import { SITE_URL } from '@/lib/constants/site-url';
import { listSongs } from '@/lib/db/r2/list-songs';
import { albumBySlug } from '@/lib/utils/album-by-slug';
import { orderedAlbumMeta } from '@/lib/utils/ordered-album-meta';
import { toPlayableUrl } from '@/lib/utils/to-playable-url';
import '@/components/styles/interior-pages.css';
import '@/components/styles/album-shelf.css';
import '@/components/styles/album-page.css';

const COVER_SIZE = 900;

export function generateStaticParams() {
  return orderedAlbumMeta().map((album) => ({ slug: album.slug }));
}

function describe(title: string, year?: number, blurb?: string): string {
  if (blurb) return blurb;
  const released = year ? ` Released ${year}.` : '';
  return `${title} by LE FOG — full tracklist and streaming.${released}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = albumBySlug(slug);
  if (!album) return { title: 'Album not found' };

  const description = describe(album.title, album.year, album.blurb);

  return {
    title: album.title,
    description,
    alternates: { canonical: `${SITE_URL}/albums/${album.slug}` },
    openGraph: {
      type: 'music.album',
      title: `${album.title} | LE FOG`,
      description,
      url: `${SITE_URL}/albums/${album.slug}`,
      images: album.cover
        ? [
            {
              url: album.cover,
              width: COVER_SIZE,
              height: COVER_SIZE,
              alt: `Cover art for ${album.title} by LE FOG`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${album.title} | LE FOG`,
      description,
      images: album.cover ? [album.cover] : undefined,
    },
  };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = albumBySlug(slug);
  if (!album) notFound();

  const accessLevel = await getAccessLevel();
  const catalog = await listSongs();

  const songs = accessLevel === 'guest' ? catalog : toPlayableUrl(catalog);
  const albumSongs = songs.filter((song) => song.album === album.key);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    '@id': `${SITE_URL}/#${album.key}`,
    name: album.title,
    url: `${SITE_URL}/albums/${album.slug}`,
    byArtist: { '@type': 'MusicGroup', '@id': `${SITE_URL}/#artist` },
    ...(album.year ? { datePublished: String(album.year) } : {}),
    ...(album.cover ? { image: `${SITE_URL}${album.cover}` } : {}),
    ...(albumSongs.length
      ? {
          numTracks: albumSongs.length,
          track: albumSongs.map((song, i) => ({
            '@type': 'MusicRecording',
            position: song.track ?? i + 1,
            name: song.title,
          })),
        }
      : {}),
  };

  return (
    <div className='page-wrapper page-wrapper--interior'>
      <SiteHeader variant='interior' />
      <main className='interior-main album-page'>
        <script type='application/ld+json'>
          {JSON.stringify(jsonLd).replace(/</g, '\\u003c')}
        </script>

        <nav className='album-page-back'>
          <Link href='/albums'>← All albums</Link>
        </nav>

        <header className='album-page-header'>
          {album.cover && (
            <div className='album-page-cover'>
              <Image
                src={album.cover}
                alt={`Cover art for ${album.title} by LE FOG`}
                width={COVER_SIZE}
                height={COVER_SIZE}
                sizes='(max-width: 639px) min(100vw, 320px), 220px'
                className='album-page-cover-img'
                priority
              />
            </div>
          )}

          <div className='album-page-meta'>
            <h1 className='album-page-title'>{album.title}</h1>
            <p className='album-page-facts'>
              <span>{album.catalog}</span>
              {album.year && <span>{album.year}</span>}
              {albumSongs.length > 0 && (
                <span>
                  {albumSongs.length} track{albumSongs.length === 1 ? '' : 's'}
                </span>
              )}
            </p>
            {album.blurb && <p className='album-page-blurb'>{album.blurb}</p>}
          </div>
        </header>
        {accessLevel === 'guest' && albumSongs.length > 0 && (
          <p className='album-page-note'>
            Streaming is free with an account.{' '}
            <Link href='/sign-up'>Sign up free</Link>
          </p>
        )}

        {albumSongs.length > 0 ? (
          <AlbumTracks
            catalog={songs}
            albumSongs={albumSongs}
            accessLevel={accessLevel}
          />
        ) : (
          <p className='album-page-empty'>
            This album's tracks aren't available yet.
          </p>
        )}
      </main>
    </div>
  );
}
