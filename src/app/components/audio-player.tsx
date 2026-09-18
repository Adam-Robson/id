'use client';
import { useEffect, useRef, useState } from 'react';
import AudioControls from '@/app/components/audio-controls';
import '@/app/components/audio-player.css';
import { useAudio } from '@/contexts/audio-provider';
import { groupByAlbum } from '@/lib/group-by-album';

/**
 * The site's one and only player: a bar pinned to the bottom of the viewport
 * with the transport, the now-playing readout and a track list that slides up
 * out of it. Mounted once from the global provider, so playback survives
 * navigation and every page gets the same controls at every width.
 *
 * It reads the catalog from context rather than taking it as a prop — the
 * page underneath it changes, the player doesn't. Pages that have tracks
 * publish them with <SongCatalog>.
 */
export default function AudioPlayer() {
  const [listOpen, setListOpen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const { songs, songsLoaded, current, playAt } = useAudio();

  // Close the track list when clicking anywhere outside the player.
  useEffect(() => {
    if (!listOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!playerRef.current?.contains(e.target as Node)) {
        setListOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [listOpen]);

  if (!songsLoaded) return null;

  const albums = groupByAlbum(songs);

  return (
    <div className='audio-player'>
      <div className='audio-player-inner' ref={playerRef}>
        {/* song list panel — slides up from player */}
        <div
          className={`audio-player-list${listOpen ? ' open' : ''}`}
          aria-hidden={!listOpen}
        >
          {Object.entries(albums).map(([album, albumSongs]) => (
            <div key={album} className='audio-player-album'>
              <h3 className='audio-player-album-title'>{album}</h3>
              <ul className='audio-player-album-songs'>
                {albumSongs.map((song) => {
                  const idx = songs.indexOf(song);
                  const isActive = idx === current;
                  return (
                    <li key={song.key}>
                      <button
                        type='button'
                        className={`audio-player-album-song${isActive ? ' active' : ''}`}
                        onClick={() => {
                          playAt(idx);
                          setListOpen(false);
                        }}
                        tabIndex={listOpen ? 0 : -1}
                      >
                        {song.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Controls bar */}
        <div className='audio-player-controls'>
          <AudioControls
            onToggleList={() => setListOpen((o) => !o)}
            listOpen={listOpen}
          />
        </div>
      </div>
    </div>
  );
}
