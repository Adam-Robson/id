'use client';
import { useEffect } from 'react';
import { useAudio } from '@/context/audio-provider';
import type { Song } from '@/lib/types/song';

/**
 * Delivers the list of songs to the audio player for playback on each page.
 * @param param0
 * @returns
 */
export default function SongCatalog({ songs }: { songs: Song[] }) {
  const { setSongs } = useAudio();

  useEffect(() => {
    setSongs(songs);
  }, [songs, setSongs]);

  return null;
}
