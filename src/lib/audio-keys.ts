const AUDIO_EXTENSIONS = /\.(mp3|wav|flac|ogg|m4a|aac)$/i;

/**
 * Whether a bucket key names an audio file.
 *
 * This is a security boundary, not a convenience check. Both signing routes
 * take a key from the query string, so without it a signed-in visitor could
 * ask for any object in the bucket — including the contact submissions
 * stored under `contacts/`.
 */
export function isAudioKey(key: string): boolean {
  return AUDIO_EXTENSIONS.test(key);
}
