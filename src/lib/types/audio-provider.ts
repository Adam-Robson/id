  export interface AudioProviderType {
    songRef?: React.RefObject<HTMLAudioElement | null>;
    isPlaying?: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    togglePlay: () => void;
    seek: (e: React.ChangeEvent<HTMLInputElement>) => void;
    progress: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    duration: number;
    setDuration: React.Dispatch<React.SetStateAction<number>>;
    fmt: (s: number) => string;
  }
  