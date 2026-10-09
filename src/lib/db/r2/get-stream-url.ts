import { signObject } from '@/lib/db/r2/sign-object';
/** Playback URL for a member. Followed immediately by the audio element. */
export function getStreamUrl(key: string): Promise<string | null> {
  return signObject(key, { attachment: false });
}
