'use client'
import { useEffect } from 'react';
import { useAudio } from '@/app/contexts/audio-provider';
import type { AudioControlsProps } from '@@/types/audio-controls';
import '@/app/components/audio-controls.css';

export default function AudioControls({ src, title, album, onToggleList, listOpen }: AudioControlsProps) {
  const audioContext = useAudio();

  useEffect(() => {
    const audio = audioContext?.songRef?.current;
    if (!audio) return;

    audioContext.setProgress(0);
    audioContext.setIsPlaying(false);
    audio.load();

    const onTimeUpdate = () => audioContext.setProgress(audio.currentTime);
    const onLoadedMetadata = () => audioContext.setDuration(audio.duration);
    const onEnded = () => audioContext.setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  if (!audioContext) return null;

  const { songRef, isPlaying, togglePlay, seek, progress, duration, fmt } = audioContext;

  return (
    <div 
      className="audio-controls" 
      role="region" 
      aria-label="Audio controls"
    >
      <audio ref={songRef} src={src} preload="metadata" />

      {/* Seek */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={progress}
        onChange={seek}
        className="seek"
      />

      {/* controls */}
      <div className="controls">
        {/* song */}
        <div key={src} className="song-info">
          <p 
            className="song-title"

          style={{
            margin: 0,
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--tuscan)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {title}
          </p>
          <p className="song-album">
            {album}
          </p>
        </div>

        {/* duration */}
        <span className="song-duration">
          {fmt(progress)} / {fmt(duration)}
        </span>

        {/* Play / Pause */}
        <button
          className="play-pause"
          onClick={togglePlay}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        {/* Toggle song list */}
        <button
          onClick={onToggleList}
          aria-label={listOpen ? 'Close song list' : 'Open song list'}
          className={`toggle-list${listOpen ? ' open' : ''}`}
        >
          ▲
        </button>
      </div>
    </div>
  );
}
