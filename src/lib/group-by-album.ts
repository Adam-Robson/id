import type { Song } from "@/types/song";

export function groupByAlbum(songs: Song[]): Record<string, Song[]> {
  return songs.reduce<Record<string, Song[]>>((acc, song) => {
    if (!acc[song.album]) acc[song.album] = [];
    acc[song.album].push(song);
    return acc;
  }, {});
}
