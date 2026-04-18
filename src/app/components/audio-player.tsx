"use client";
import { useEffect, useState } from "react";
import AudioControls from "@/app/components/audio-controls";
import type { Song } from "@/types/song";
import "@/app/components/audio-player.css";
import { useAudio } from "@/contexts/audio-provider";
import { groupByAlbum } from "@/lib/group-by-album";

export default function AudioPlayer({ songs }: { songs: Song[] }) {
  const [listOpen, setListOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const { current, setCurrent, setSongs } = useAudio();

  useEffect(() => {
    setSongs(songs);
  }, [songs, setSongs]);

  if (!songs.length) return null;

  const albums = groupByAlbum(songs);

  return (
    <div className="audio-player">
      <div className="audio-player-inner">
        {/* song list panel — slides up from player */}
        <div
          className={`audio-player-list${listOpen ? " open" : ""}`}
          aria-hidden={!listOpen}
        >
          {Object.entries(albums).map(([album, albumSongs]) => (
            <div key={album} className="audio-player-album">
              <h3 className="audio-player-album-title">{album}</h3>
              <ul className="audio-player-album-songs">
                {albumSongs.map((song) => {
                  const idx = songs.indexOf(song);
                  const isActive = idx === current;
                  return (
                    <li key={song.key}>
                      <button
                        type="button"
                        className={`audio-player-album-song${isActive ? " active" : ""}`}
                        onClick={() => {
                          setCurrent(idx);
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
        <div className="audio-player-controls">
          <AudioControls
            onToggleList={() => setListOpen((o) => !o)}
            listOpen={listOpen}
            minimized={minimized}
            onExpand={() => setMinimized(false)}
          />
        </div>
      </div>
    </div>
  );
}
