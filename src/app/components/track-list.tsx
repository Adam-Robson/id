"use client";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { useAudio } from "@/contexts/audio-provider";
import type { AccessLevel } from "@/types/access-level";
import type { SongMeta } from "@/types/song-meta";

/**
 * Renders one album's tracks. Shared by the shelf and the album pages so
 * the access rules — who gets a play button, who gets a download link —
 * are written once and can't drift between the two.
 *
 * `catalog` is the full song list because playback is indexed against it:
 * next/previous should walk the whole discography, not stop at the end of
 * whichever album the listener happened to open.
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
  const canPlay = accessLevel !== "guest";
  const canDownload = accessLevel === "admin";
  const { current, isPlaying, playAt } = useAudio();
  const currentSong: SongMeta | undefined = catalog[current];

  return (
    <ol className="tape-card-tracks">
      {albumSongs.map((song, i) => {
        const idx = catalog.indexOf(song);
        const isActive = canPlay && currentSong?.key === song.key;
        const trackNumber = String(song.track ?? i + 1).padStart(2, "0");

        return (
          <li key={song.key} className="tape-track-row">
            {canPlay ? (
              <button
                type="button"
                className={`tape-track${isActive ? " active" : ""}`}
                onClick={() => playAt(idx)}
                aria-label={`Play ${song.title}`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="tape-track-num">{trackNumber}</span>
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
            ) : (
              <span className="tape-track tape-track--locked">
                <span className="tape-track-num">{trackNumber}</span>
                <span className="tape-track-title">{song.title}</span>
              </span>
            )}
            {canDownload && (
              <a
                className="tape-track-download"
                href={`/api/download?key=${encodeURIComponent(song.key)}`}
                aria-label={`Download ${song.title}`}
              >
                <DownloadSimpleIcon
                  size={16}
                  weight="regular"
                  aria-hidden="true"
                />
              </a>
            )}
          </li>
        );
      })}
    </ol>
  );
}
