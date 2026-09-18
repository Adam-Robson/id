'use client';
import SongCatalog from '@/app/components/song-catalog';
import TrackList from '@/app/components/track-list';
import type { AccessLevel } from '@/types/access-level';
import type { Song } from '@/types/song';
import type { SongMeta } from '@/types/song-meta';

/**
 * The tracklist on a single album's page. Publishes the whole catalog to the
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

  return (
    <>
      {canPlay && <SongCatalog songs={catalog as Song[]} />}
      <TrackList
        catalog={catalog}
        albumSongs={albumSongs}
        accessLevel={accessLevel}
      />
    </>
  );
}
