/**
 * Represents a raw song as stored in the R2 bucket,
 * before any parsing or formatting.
 */
export type RawSong = {
  key: string;
  album: string;
  name: string;
};
