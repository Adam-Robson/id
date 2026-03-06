'use client'
import { useState } from 'react';
import AudioControls from '@/app/components/audio-controls';
import type { Song } from '@@/types/song';

export default function AudioPlayer({ songs }: { songs: Song[] }) {
  const [current, setCurrent] = useState(0);

  if (!songs.length) {
    return <p className="text-sm text-neutral-400">No songs found in bucket.</p>;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <AudioControls src={songs[current].url} title={songs[current].title} />
      {songs.length > 1 && (
        <ul className="flex flex-col gap-1">
          {songs.map((song, i) => (
            <li key={song.key}>
              <button
                onClick={() => setCurrent(i)}
                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${
                  i === current
                    ? 'bg-white text-black font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {song.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
