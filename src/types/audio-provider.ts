import type { Song } from "@/types/song";

export interface AudioProviderType {
  isPlaying: boolean;
  togglePlay: () => void;
  seek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  progress: number;
  duration: number;
  fmt: (s: number) => string;
  songs: Song[];
  setSongs: (songs: Song[]) => void;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  songsLoaded: boolean;
  prev: () => void;
  next: () => void;
}
