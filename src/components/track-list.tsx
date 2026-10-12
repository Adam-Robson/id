'use client';
import { DownloadSimpleIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import PhosphorIcon from '@/components/phosphor-icon';
import { useAudio } from '@/context/audio-provider';
import type { AccessLevel } from '@/lib/types/access-level';
import type { SongMeta } from '@/lib/types/song-meta';
import '@/components/styles/track-list.css';
/**
 * Renders the track list for an album. Permissions for playback
 * and download are controlled here.
 * @param catalog The full list of songs in the catalog.
 * @param albumSongs The list of songs in the current album.
 * @param accessLevel The access level of the current user.
 * @returns The rendered track list component.
 *
 */
export default function TrackList({
  catalog,
  albumSongs,
  accessLevel,
}: {
  catalog: SongMeta[];
  albumSongs: SongMeta[];
  accessLevel: AccessLevel;
}) {
  const canPlay = accessLevel !== 'guest';
  const canDownload = accessLevel !== 'guest';
  const { current, isPlaying, playAt } = useAudio();
  const currentSong: SongMeta | undefined = catalog[current];

  return (
    <ol className='track-list'>
      {albumSongs.map((song, i) => {
        const idx = catalog.indexOf(song);
        const isActive = canPlay && currentSong?.key === song.key;
        const trackNumber = String(song.track ?? i + 1).padStart(2, '0');

        return (
          <li key={song.key} className='track-row'>
            {canPlay ? (
              <button
                type='button'
                className={`track${isActive ? ' active' : ''}`}
                onClick={() => playAt(idx)}
                aria-label={`Play ${song.title}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className='track-num'>{trackNumber}</span>
                <span className='track-title'>{song.title}</span>
                {isActive && (
                  <span
                    className={`track-meter${isPlaying ? ' playing' : ''}`}
                    aria-hidden='true'
                  >
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              </button>
            ) : (
              <span className='track track--locked'>
                <span className='track-num'>{trackNumber}</span>
                <span className='track-title'>{song.title}</span>
              </span>
            )}
            {canDownload && (
              <Link
                className='track-download'
                href={`/api/download?key=${encodeURIComponent(song.key)}`}
                aria-label={`Download ${song.title}`}
              >
                <PhosphorIcon
                  as={DownloadSimpleIcon}
                  size='1.125rem'
                  aria-hidden='true'
                />
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
