const AUDIO_EXTENSIONS = /\.(mp3|wav|flac|ogg|m4a|aac)$/i;

/**
 * This function is a security boundary that ensures only
 * audio files are processed. Requests are validated by
 * checking that the provided filename contains a valid
 * audio file extension.
 */
export function isAudioFile(f: string): boolean {
  return AUDIO_EXTENSIONS.test(f);
}
