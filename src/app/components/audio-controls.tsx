"use client";
import { useAudio } from "@/contexts/audio-provider";
import type { AudioControlsProps } from "@/types/audio-controls";
import "@/app/components/audio-controls.css";

export default function AudioControls({
  onToggleList,
  listOpen,
  onPrev,
  onNext,
  minimized,
  onExpand,
}: AudioControlsProps) {
  const audioContext = useAudio();

  if (!audioContext) return null;

  const {
    isPlaying,
    togglePlay,
    seek,
    progress,
    duration,
    fmt,
    songs,
    current,
  } = audioContext;

  const title = songs[current]?.title ?? "";
  const album = songs[current]?.album ?? "";

  return (
    <section
      className={`audio-controls${minimized ? " audio-controls--minimized" : ""}`}
      aria-label="Audio controls"
      onClick={minimized ? onExpand : undefined}
      onKeyDown={
        minimized
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onExpand?.();
            }
          : undefined
      }
      style={minimized ? { cursor: "pointer" } : undefined}
    >
      {/* Seek */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={progress}
        onChange={seek}
        className="seek"
        aria-label="Seek"
        aria-valuetext={`${fmt(progress)} of ${fmt(duration)}`}
      />

      {/* controls */}
      <div className="controls">
        {/* song */}
        <div key={songs[current]?.url} className="song-info">
          <p className="song-title">{title}</p>
          <p className="song-album">{album}</p>
        </div>

        {/* Playback controls */}
        <div className="playback-controls">
          <button
            type="button"
            className="ctrl-btn"
            onClick={onPrev}
            aria-label="Previous song"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>
          <button
            type="button"
            className="ctrl-btn ctrl-btn--play"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
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
            className="ctrl-btn"
            onClick={onNext}
            aria-label="Next song"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8l-5.5 4zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* duration */}
        <span className="song-duration">
          {fmt(progress)} / {fmt(duration)}
        </span>

        {/* Toggle song list */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleList();
          }}
          aria-label={listOpen ? "Close song list" : "Open song list"}
          className={`toggle-list${listOpen ? " open" : ""}`}
        >
          <span className="toggle-list-label">TRACKS</span>▲
        </button>
      </div>
    </section>
  );
}
