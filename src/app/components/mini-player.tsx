"use client";
import { usePathname } from "next/navigation";
import { useAudio } from "@/contexts/audio-provider";
import "@/app/components/mini-player.css";

export default function MiniPlayer() {
  const pathname = usePathname();
  const audioContext = useAudio();

  // Hide on home (full player is there) or if no songs loaded
  if (!audioContext?.songsLoaded || pathname === "/") return null;

  const {
    songs,
    current,
    isPlaying,
    togglePlay,
    seek,
    progress,
    duration,
    fmt,
    prev,
    next,
  } = audioContext;
  const title = songs[current]?.title ?? "";
  const album = songs[current]?.album ?? "";

  return (
    <section className="mini-player" aria-label="Audio player">
      <div className="mini-player-inner">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={seek}
          className="mini-player-seek"
          aria-label="Seek"
          aria-valuetext={`${fmt(progress)} of ${fmt(duration)}`}
        />
        <div className="mini-player-controls">
          <div className="mini-player-info">
            <span className="mini-player-title">{title}</span>
            <span className="mini-player-album">{album}</span>
          </div>

          <div className="mini-player-buttons">
            <button
              type="button"
              className="mini-player-btn"
              onClick={prev}
              aria-label="Previous song"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
              </svg>
            </button>
            <button
              type="button"
              className="mini-player-btn mini-player-btn--play"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="mini-player-btn"
              onClick={next}
              aria-label="Next song"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8l-5.5 4zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          <span className="mini-player-duration">
            {fmt(progress)} / {fmt(duration)}
          </span>
        </div>
      </div>
    </section>
  );
}
