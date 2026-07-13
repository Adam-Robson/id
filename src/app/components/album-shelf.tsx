"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useAudio } from "@/contexts/audio-provider";
import { orderedAlbums } from "@/lib/albums";
import type { Song } from "@/types/song";
import "@/app/components/album-shelf.css";

export default function AlbumShelf({ songs }: { songs: Song[] }) {
  const { current, isPlaying, playAt, setSongs } = useAudio();

  useEffect(() => {
    setSongs(songs);
  }, [songs, setSongs]);

  if (!songs.length) return null;

  const albums = orderedAlbums(songs);
  const currentSong: Song | undefined = songs[current];

  return (
    <div className="album-shelf">
      {albums.map(({ meta, songs: albumSongs }) => (
        <section
          key={meta.key}
          className="tape-card"
          aria-labelledby={`album-${meta.key}`}
        >
          <header className="tape-card-label">
            <span className="tape-card-catalog">
              {meta.catalog}
              {meta.year ? ` · ${meta.year}` : ""}
            </span>
            <span className="tape-card-count">{albumSongs.length} songs</span>
          </header>

          {meta.cover && (
            <div className="tape-card-cover">
              <Image
                src={meta.cover}
                alt={`Cover of ${meta.key}`}
                fill
                sizes="(max-width: 640px) 100vw, 420px"
                className="tape-card-cover-img"
              />
            </div>
          )}

          <div className="tape-card-body">
            <h2 id={`album-${meta.key}`} className="tape-card-title">
              {meta.key}
            </h2>
            {meta.blurb && <p className="tape-card-blurb">{meta.blurb}</p>}

            <ol className="tape-card-tracks">
              {albumSongs.map((song, i) => {
                const idx = songs.indexOf(song);
                const isActive = currentSong?.key === song.key;
                return (
                  <li key={song.key}>
                    <button
                      type="button"
                      className={`tape-track${isActive ? " active" : ""}`}
                      onClick={() => playAt(idx)}
                      aria-label={`Play ${song.title}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span className="tape-track-num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="tape-track-title">{song.title}</span>
                      {isActive && (
                        <span
                          className={`tape-track-meter${isPlaying ? " playing" : ""}`}
                          aria-hidden="true"
                        >
                          <i />
                          <i />
                          <i />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ))}
    </div>
  );
}
