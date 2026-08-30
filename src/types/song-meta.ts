export interface SongMeta {
  key: string;
  title: string;
  album: string;
  /** Track number parsed from the filename, when the file carries one. */
  track?: number;
}
