'use client'

import { createContext, useContext, useState, useRef } from 'react';
import type { AudioProviderType } from '@/types/audio-provider';


const AudioContext = createContext<AudioProviderType | null>(null);

export const useAudio = () => {
  if (!AudioContext || AudioContext === null) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return useContext(AudioContext);
}

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const songRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!songRef.current) return;
    if (isPlaying) {
      songRef.current.pause();
    } else {
      songRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!songRef.current) return;
    songRef.current.currentTime = Number(e.target.value);
    setProgress(Number(e.target.value));
  }

  const fmt = (s: number) => {
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  }

  return (
    <AudioContext.Provider 
      value={{
         songRef, 
         isPlaying,
         setIsPlaying,
         togglePlay,
         seek, 
         progress, 
         setProgress,
         duration,
         setDuration,
         fmt 
      }}>
      {children}
    </AudioContext.Provider>
  )
}
