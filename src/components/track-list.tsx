'use client';
import { DownloadSimpleIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import PhosphorIcon from '@/components/phosphor-icon';
import { useAudio } from '@/context/audio-provider';
import type { AccessLevel } from '@/lib/types/access-level';
import type { SongMeta } from '@/lib/types/song-meta';
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
    <ol className='tape-card-tracks'>
      {albumSongs.map((song, i) => {
        const idx = catalog.indexOf(song);
        const isActive = canPlay && currentSong?.key === song.key;
        const trackNumber = String(song.track ?? i + 1).padStart(2, '0');

        return (
          <li key={song.key} className='tape-track-row'>
            {canPlay ? (
              <button
                type='button'
                className={`tape-track${isActive ? ' active' : ''}`}
                onClick={() => playAt(idx)}
                aria-label={`Play ${song.title}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className='tape-track-num'>{trackNumber}</span>
                <span className='tape-track-title'>{song.title}</span>
                {isActive && (
                  <span
                    className={`tape-track-meter${isPlaying ? ' playing' : ''}`}
                    aria-hidden='true'
                  >
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              </button>
            ) : (
              <span className='tape-track tape-track--locked'>
                <span className='tape-track-num'>{trackNumber}</span>
                <span className='tape-track-title'>{song.title}</span>
              </span>
            )}
            {canDownload && (
              <Link
                className='tape-track-download'
                href={`/api/download?key=${encodeURIComponent(song.key)}`}
                aria-label={`Download ${song.title}`}
              >
                <PhosphorIcon
                  as={DownloadSimpleIcon}
                  size={16}
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
