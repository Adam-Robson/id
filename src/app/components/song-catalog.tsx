'use client';
import { useEffect } from 'react';
import { useAudio } from '@/contexts/audio-provider';
import type { Song } from '@/types/song';

/**
 * Hands a page's catalog to the player and renders nothing itself.
 *
 * The player is mounted once for the whole site, so it can't take the song
 * list as a prop from whichever page happens to have loaded it. Any page
 * with playable tracks drops one of these in instead.
 */
export default function SongCatalog({ songs }: { songs: Song[] }) {
  const { setSongs } = useAudio();

  useEffect(() => {
    setSongs(songs);
  }, [songs, setSongs]);

  return null;
}
