import { AUDIO_EXTENSIONS } from '@/lib/constants/audio-extensions';
/**
 * Whether a bucket key has an audio file extension.
 *
 * This is a security boundary, not a convenience check. Both signing routes
 * take a key from the query string, so without it a signed-in visitor could
 * ask for any object in the bucket — including the contact submissions
 * stored under `contacts/`.
 */
export function isAudioExtension(key: string): boolean {
  return AUDIO_EXTENSIONS.test(key);
}
