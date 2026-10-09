import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { STREAM_URL_TTL_SECONDS } from '@/lib/constants/stream-url';
import { s3 } from '@/lib/db/r2/s3';
import { isAudioExtension } from '@/lib/utils/is-audio-extension';

/**
 * Returns a presigned URL for a single object.
 * @param key The key of the object to sign.
 * @param attachment Whether the object should be served as an attachment.
 * @returns A presigned URL for the object, or null if the key is not an audio file.
 */
export async function signObject(
  key: string,
  { attachment }: { attachment: boolean },
): Promise<string | null> {
  if (!isAudioExtension(key)) return null;

  const filename = key
    .slice(key.lastIndexOf('/') + 1)
    .replace(/["\\\p{Cc}]/gu, '_');
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      ...(attachment
        ? { ResponseContentDisposition: `attachment; filename="${filename}"` }
        : {}),
    }),
    { expiresIn: attachment ? 300 : STREAM_URL_TTL_SECONDS },
  );
}
