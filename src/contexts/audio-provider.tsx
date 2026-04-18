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
  const shouldPlayRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songs, setSongsState] = useState<Song[]>([]);
  const [current, setCurrent] = useState(0);
  const songsLoaded = songs.length > 0;

  const currentSrc = songs[current]?.url ?? "";

  // Only set songs if not already loaded (prevents resetting on re-mount of home page)
  const setSongs = useCallback((incoming: Song[]) => {
    setSongsState((prev) => {
      if (prev.length > 0) return prev;
      return incoming;
    });
  }, []);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + songs.length) % songs.length);
  }, [songs.length]);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % songs.length);
  }, [songs.length]);

  const togglePlay = useCallback(() => {
    if (!songRef.current) return;
    if (isPlaying) {
      songRef.current.pause();
      shouldPlayRef.current = false;
    } else {
      songRef.current.play();
      shouldPlayRef.current = true;
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!songRef.current) return;
    songRef.current.currentTime = Number(e.target.value);
    setProgress(Number(e.target.value));
  }, []);

  const fmt = useCallback((s: number) => {
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  }, []);

  // Wire up audio event listeners
  useEffect(() => {
    const audio = songRef.current;
    if (!audio || !currentSrc) return;

    setProgress(0);
    audio.load();

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      if (shouldPlayRef.current) {
        audio.play().then(
          () => setIsPlaying(true),
          () => setIsPlaying(false),
        );
      } else {
        setIsPlaying(false);
      }
    };
    const onEnded = () => {
      shouldPlayRef.current = true;
      setCurrent((i) => (i + 1) % songs.length);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentSrc, songs.length]);

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
        setCurrent,
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

      {currentSrc && (
        <audio ref={songRef} src={currentSrc} preload="metadata">
          <track kind="captions" />
        </audio>
      )}
      {children}
    </AudioContext.Provider>
  );
};
