import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/db/r2/s3';
import type { AudioObject } from '@/lib/types/audio-object';
import { parseSongTitle } from '@/lib/utils/parse-song-title';

/**
 * Lists all audio objects in the bucket.
 * @returns A list of audio objects in the bucket.
 */
export async function listAudioObjects(): Promise<AudioObject[]> {
  const list = await s3.send(
    new ListObjectsV2Command({ Bucket: process.env.BUCKET_NAME }),
  );

  return (list.Contents ?? [])
    .filter(
      (obj: { Key?: string }) => obj.Key != null && parseSongTitle(obj.Key),
    )
    .map((obj: { Key?: string; LastModified?: Date }) => ({
      key: obj.Key as string,
      lastModified: obj.LastModified,
    }));
}
