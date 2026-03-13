'use client'
import { useState } from 'react';
import AudioControls from '@/app/components/audio-controls';
import type { Song } from '@/types/song';
import '@/app/components/audio-player.css';
import { groupByAlbum } from '@/lib/group-by-album';

export default function AudioPlayer({ songs }: { songs: Song[] }) {
  const [current, setCurrent] = useState(0);
  const [listOpen, setListOpen] = useState(false);

  if (!songs.length) return null;

  const albums = groupByAlbum(songs);

  return (
    <div className="audio-player">
      <div className="audio-player-inner">
        {/* song list panel — slides up from player */}
        <div className={`audio-player-list${listOpen ? ' open' : ''}`} aria-hidden={!listOpen}>
          {Object.entries(albums).map(([album, albumSongs]) => (
            <div key={album} className="audio-player-album">
              <p className="audio-player-album-title">
                {album}
              </p>
              <ul className="audio-player-album-songs">
                {albumSongs.map((song) => {
                  const idx = songs.indexOf(song);
                  const isActive = idx === current;
                  return (
                    <li key={song.key}>
                      <button
                        className={`audio-player-album-song${isActive ? ' active' : ''}`}
                        onClick={() => { setCurrent(idx); setListOpen(false); }}
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
        <div className="audio-player-controls">
          <AudioControls
            src={songs[current].url}
            title={songs[current].title}
            album={songs[current].album}
            onToggleList={() => setListOpen(o => !o)}
            listOpen={listOpen}
          />
        </div>

      </div>
    </div>
  );
}
