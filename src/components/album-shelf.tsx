'use client';
import Image from 'next/image';
import Link from 'next/link';
import SongCatalog from '@/components/song-catalog';
import TrackList from '@/components/track-list';
import type { AccessLevel } from '@/lib/types/access-level';
import type { Song } from '@/lib/types/song';
import type { SongMeta } from '@/lib/types/song-meta';
import { orderedAlbums } from '@/lib/utils/ordered-albums';
import '@/components/styles/album-shelf.css';
export default function AlbumShelf({
  songs,
  accessLevel,
}: {
  songs: SongMeta[];
  accessLevel: AccessLevel;
}) {
  const canPlay = accessLevel !== 'guest';

  if (!songs.length) return null;

  const albums = orderedAlbums(songs);

  return (
    <div className='album-shelf'>
      {canPlay && <SongCatalog songs={songs as Song[]} />}
      {albums.map(({ meta, songs: albumSongs }) => (
        <section
          key={meta.key}
          className='album-tile'
          aria-labelledby={`album-${meta.key}`}
        >
          {meta.cover && (
            <div className='album-tile-cover'>
              <Image
                src={meta.cover}
                alt={`Cover art for ${meta.title} by LE FOG`}
                fill
                sizes='(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px'
                className='album-tile-cover-img'
              />
            </div>
          )}

          <p className='album-tile-facts label'>
            <span>
              {meta.catalog}
              {meta.year ? ` · ${meta.year}` : ''}
            </span>
            <span>{albumSongs.length} songs</span>
          </p>
          <h2 id={`album-${meta.key}`} className='album-tile-title'>
            <Link href={`/albums/${meta.slug}`} className='album-tile-link'>
              {meta.title}
            </Link>
          </h2>
          {meta.blurb && <p className='album-tile-blurb'>{meta.blurb}</p>}

          <TrackList
            catalog={songs}
            albumSongs={albumSongs}
            accessLevel={accessLevel}
          />
        </section>
      ))}
    </div>
  );
}
