"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { AudioProviderType } from "@/types/audio-provider";
import type { Song } from "@/types/song";

const AudioContext = createContext<AudioProviderType | null>(null);

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return ctx;
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const songRef = useRef<HTMLAudioElement | null>(null);
  // Tracks the URL we've loaded imperatively so the sync effect below doesn't
  // reload (and interrupt) a track we just started inside a user gesture.
  const loadedSrcRef = useRef("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songs, setSongsState] = useState<Song[]>([]);
  const [current, setCurrent] = useState(0);
  const songsLoaded = songs.length > 0;

  // Only set songs if not already loaded (prevents resetting on re-mount of home page)
  const setSongs = useCallback((incoming: Song[]) => {
    setSongsState((prev) => {
      if (prev.length > 0) return prev;
      return incoming;
    });
  }, []);

  // Switch to a track and start playback. Must be called from within a user
  // gesture (click) so the play() is allowed by browser autoplay policies —
  // Safari in particular blocks any play() not tied to a live gesture.
  const switchTo = useCallback(
    (idx: number) => {
      const audio = songRef.current;
      const url = songs[idx]?.url;
      if (audio && url) {
        // Assigning src already starts the load — calling load() too would
        // reset it and abort the play() below. Only force load() to recover
        // from an error on the same source.
        if (audio.src !== url) {
          audio.src = url;
        } else if (audio.error) {
          audio.load();
        }
        loadedSrcRef.current = url;
        setProgress(0);
        audio.play().catch(() => {});
      }
      setCurrent(idx);
    },
    [songs],
  );

  const prev = useCallback(() => {
    if (!songs.length) return;
    switchTo((current - 1 + songs.length) % songs.length);
  }, [current, songs.length, switchTo]);

  const next = useCallback(() => {
    if (!songs.length) return;
    switchTo((current + 1) % songs.length);
  }, [current, songs.length, switchTo]);

  const togglePlay = useCallback(() => {
    const audio = songRef.current;
    if (!audio) return;
    if (audio.paused) {
      const url = songs[current]?.url;
      // Recover if the element errored or lost its source — calling play() on
      // an errored element just rejects, so reset the source and reload first.
      if (url && (audio.error || audio.src !== url || audio.readyState === 0)) {
        audio.src = url;
        loadedSrcRef.current = url;
        audio.load();
      }
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [current, songs]);

  const playAt = useCallback(
    (idx: number) => {
      if (idx === current) {
        // Same track already selected — toggle pause/play.
        togglePlay();
        return;
      }
      switchTo(idx);
    },
    [current, switchTo, togglePlay],
  );

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!songRef.current) return;
    songRef.current.currentTime = Number(e.target.value);
    setProgress(Number(e.target.value));
  }, []);

  const fmt = useCallback((s: number) => {
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  }, []);

  // Load the current track's source (without autoplaying) and wire up event
  // listeners. Skips loading when the track was already started imperatively.
  useEffect(() => {
    const audio = songRef.current;
    if (!audio) return;
    const url = songs[current]?.url;
    if (!url) return;

    if (audio.src !== url && loadedSrcRef.current !== url) {
      setProgress(0);
      setIsPlaying(false);
      audio.src = url; // assigning src starts the load on its own
      loadedSrcRef.current = url;
    }

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsPlaying(false);
      loadedSrcRef.current = ""; // allow the next attempt to reload from scratch
    };
    const onEnded = () => {
      if (songs.length <= 1) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      // Auto-advance. play() is allowed here because the element already had
      // user-initiated playback, so this counts as continuation.
      const nextIdx = (current + 1) % songs.length;
      const nextUrl = songs[nextIdx]?.url;
      if (nextUrl) {
        audio.src = nextUrl;
        loadedSrcRef.current = nextUrl;
        audio.play().catch(() => {});
      }
      setCurrent(nextIdx);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
    };
  }, [songs, current]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        togglePlay,
        seek,
        progress,
        duration,
        fmt,
        songs,
        setSongs,
        current,
        playAt,
        songsLoaded,
        prev,
        next,
      }}
    >
      <output
        aria-live="polite"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {songsLoaded
          ? `Now playing: ${songs[current]?.title} from ${songs[current]?.album}`
          : ""}
      </output>

      {songsLoaded && (
        <audio ref={songRef} preload="metadata">
          <track kind="captions" />
        </audio>
      )}
      {children}
    </AudioContext.Provider>
  );
};
