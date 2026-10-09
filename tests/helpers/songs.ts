import type { Song } from '@/lib/types/song';
import type { SongMeta } from '@/lib/types/song-meta';
import { toPlayableUrl } from '@/lib/utils/to-playable-url';

export const META: SongMeta[] = [
  {
    key: 'albums/first/01 Opening.mp3',
    title: 'Opening',
    album: 'First',
    track: 1,
  },
  {
    key: 'albums/first/02 Middle.mp3',
    title: 'Middle',
    album: 'First',
    track: 2,
  },
  {
    key: 'albums/second/01 Closing.mp3',
    title: 'Closing',
    album: 'Second',
    track: 1,
  },
];

export const SONGS: Song[] = toPlayableUrl(META);
