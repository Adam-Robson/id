'use client'
import { useEffect } from 'react';
import { useAudio } from '@/app/contexts/audio-provider';
import type { AudioControlsProps } from '@@/types/audio-controls'

export default function AudioControls({src, title}: AudioControlsProps) {
  
  const audioContext = useAudio();
  if (!audioContext) {
    return null;
  }

  const { songRef, isPlaying, setIsPlaying, togglePlay, seek, progress, setProgress, setDuration, duration, fmt } = audioContext;

  useEffect(() => {
    const audio = songRef?.current;
    if (!audio) return;

    setProgress(0);
    setIsPlaying(false);
    audio.load();

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  return (
    <div>
      <div className="flex flex-col gap-2 p-4 rounded-xl bg-neutral-900 text-white w-full max-w-md">
      <audio ref={songRef} src={src} preload="metadata" />
      {title && <p className="text-sm font-medium truncate">{title}</p>}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={progress}
        onChange={seek}
        className="w-full accent-white"
      />
      <div className="flex justify-between text-xs text-neutral-400">
        <span>{fmt(progress)}</span>
        <span>{fmt(duration)}</span>
      </div>
      <button
        onClick={togglePlay}
        className="self-center px-6 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
    </div>
  );
}
