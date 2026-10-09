import { signObject } from '@/lib/db/r2/sign-object';
/** Download URL for a member, served as a file attachment. */
export function getDownloadUrl(key: string): Promise<string | null> {
  return signObject(key, { attachment: true });
}
