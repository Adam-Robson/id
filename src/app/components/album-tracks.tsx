'use client';
import { useEffect } from 'react';
import TrackList from '@/app/components/track-list';
import { useAudio } from '@/contexts/audio-provider';
import type { AccessLevel } from '@/types/access-level';
import type { Song } from '@/types/song';
import type { SongMeta } from '@/types/song-meta';

/**
 * The tracklist on a single album's page. Pushes the whole catalog into the
 * player — not just this album — so next/previous keeps working once the
 * last track here finishes.
 */
export default function AlbumTracks({
  catalog,
  albumSongs,
  accessLevel,
}: {
  catalog: SongMeta[];
  albumSongs: SongMeta[];
  accessLevel: AccessLevel;
}) {
  const canPlay = accessLevel !== 'guest';
  const { setSongs } = useAudio();

  useEffect(() => {
    if (canPlay) setSongs(catalog as Song[]);
  }, [catalog, canPlay, setSongs]);

  return (
    <TrackList
      catalog={catalog}
      albumSongs={albumSongs}
      accessLevel={accessLevel}
    />
  );
}
