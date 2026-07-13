export interface AlbumMeta {
  /** The album key as derived from the R2 folder name. */
  key: string;
  /** Catalog number printed on the tape label, e.g. "LF-001". */
  catalog: string;
  /** Release year. Optional — omitted years simply don't render. */
  year?: number;
  /** Path to the cover image under /public. */
  cover?: string;
  /** One short line rendered under the title. */
  blurb?: string;
  /** Position on the shelf. Lower numbers render first. */
  order: number;
}
