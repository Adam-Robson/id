/**
 * Lifetime of a signed playback URL. The audio element keeps reusing the URL
 * it was redirected to for every later range request, so this has to outlast
 * a track plus any pause. The player re-resolves through /api/stream before
 * it gets close to expiry.
 */
export const STREAM_URL_TTL_SECONDS = 60 * 60;

/** How old a loaded source can get before the player fetches a fresh one. */
export const STREAM_URL_REFRESH_MS = (STREAM_URL_TTL_SECONDS - 5 * 60) * 1000;
