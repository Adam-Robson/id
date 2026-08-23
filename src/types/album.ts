export interface AlbumMeta {
  /** The album key as derived from the R2 folder name. */
  key: string;
  /**
   * Display name, e.g. "For Before I Forget" for the key `forbeforeiforget`.
   * The key stays lowercase because it has to match the R2 folder; this is
   * what actually renders and what search engines index.
   */
  title: string;
  /**
   * URL segment for the album's own page, e.g. `for-before-i-forget`.
   * Kept separate from `key` so the R2 folder can stay as it is and so
   * punctuation (the trailing dot in `three.`) never reaches a URL.
   */
  slug: string;
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
