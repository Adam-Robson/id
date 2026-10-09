'use client';
import SongCatalog from '@/components/song-catalog';
import TrackList from '@/components/track-list';
import type { AccessLevel } from '@/lib/types/access-level';
import type { Song } from '@/lib/types/song';
import type { SongMeta } from '@/lib/types/song-meta';

/**
 * The tracklist on a single album's page. Publishes the whole catalog to the
 * player.
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
