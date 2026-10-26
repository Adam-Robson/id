'use client';
import {
  PauseIcon,
  PlayIcon,
  QueueIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from '@phosphor-icons/react';
import PhosphorIcon from '@/components/phosphor-icon';
import { useAudio } from '@/context/audio-provider';
import type { AudioControlsProps } from '@/lib/types/audio-controls.props';
import '@/components/styles/audio-controls.css';
import '@/components/styles/seek-bar.css';

export default function AudioControls({
  onToggleList,
  listOpen,
}: AudioControlsProps) {
  const {
    isPlaying,
    togglePlay,
    seek,
    progress,
    duration,
    fmt,
    songs,
    current,
    prev,
    next,
  } = useAudio();

  const title = songs[current]?.title ?? '';
  const album = songs[current]?.album ?? '';

  return (
    <section className='audio-controls' aria-label='Audio controls'>
      {/* Seek */}
      <input
        type='range'
        min={0}
        max={duration || 0}
        value={progress}
        onChange={seek}
        className='seek'
        style={
          {
            '--seek-progress': `${duration ? (progress / duration) * 100 : 0}%`,
          } as React.CSSProperties
        }
        aria-label='Seek'
        aria-valuetext={`${fmt(progress)} of ${fmt(duration)}`}
      />

      {/* controls */}
      <div className='controls'>
        {/* song */}
        <div key={songs[current]?.url} className='song-info'>
          <p className='song-title'>{title}</p>
          <p className='song-album'>{album}</p>
        </div>

        {/* Playback controls */}
        <div className='playback-controls'>
          <button
            type='button'
            className='ctrl-btn'
            onClick={prev}
            aria-label='Previous song'
          >
            <PhosphorIcon
              as={SkipBackIcon}
              size='1.25rem'
              weight='fill'
              aria-hidden='true'
            />
          </button>
          <button
            type='button'
            className='ctrl-btn ctrl-btn--play'
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <PhosphorIcon
              as={isPlaying ? PauseIcon : PlayIcon}
              size='1.25rem'
              weight='fill'
              aria-hidden='true'
            />
          </button>
          <button
            type='button'
            className='ctrl-btn'
            onClick={next}
            aria-label='Next song'
          >
            <PhosphorIcon
              as={SkipForwardIcon}
              size='1.25rem'
              weight='fill'
              aria-hidden='true'
            />
          </button>
        </div>

        {/* duration */}
        <span className='song-duration'>
          {fmt(progress)} / {fmt(duration)}
        </span>

        {/* Toggle song list */}
        <button
          type='button'
          onClick={onToggleList}
          aria-label={listOpen ? 'Close song list' : 'Open song list'}
          aria-expanded={listOpen}
          className={`toggle-list${listOpen ? ' open' : ''}`}
        >
          <PhosphorIcon as={QueueIcon} size='1.625rem' aria-hidden='true' />
        </button>
      </div>
    </section>
  );
}
