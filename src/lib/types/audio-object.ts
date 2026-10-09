/**
 * Represents an audio object stored in the R2 (S3-compatible) database.
 */
export interface AudioObject {
  key: string;
  lastModified?: Date;
}
