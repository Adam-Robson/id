import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { isAudioKey } from '@/lib/audio-keys';
import { deriveCatalog, splitKey } from '@/lib/parse-song-meta';
import type { Song } from '@/types/song';
import type { SongMeta } from '@/types/song-meta';

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_API,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? '',
  },
});

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}

export async function saveContact(
  data: Omit<ContactSubmission, 'id' | 'submittedAt'>,
) {
  const submission: ContactSubmission = {
    id: crypto.randomUUID(),
    ...data,
    submittedAt: new Date().toISOString(),
  };

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `contacts/${submission.submittedAt}_${submission.id}.json`,
      Body: JSON.stringify(submission),
      ContentType: 'application/json',
    }),
  );

  return submission;
}

export interface AudioObject {
  key: string;
  lastModified?: Date;
}

async function listAudioObjects(): Promise<AudioObject[]> {
  const list = await r2.send(
    new ListObjectsV2Command({ Bucket: process.env.BUCKET_NAME }),
  );

  return (list.Contents ?? [])
    .filter((obj) => obj.Key != null && isAudioKey(obj.Key))
    .map((obj) => ({
      key: obj.Key as string,
      lastModified: obj.LastModified,
    }));
}

/**
 * Track metadata only — no signed URL. Safe to expose to any visitor,
 * signed in or not, since it grants no access to the underlying files.
 */
export async function listSongs(): Promise<SongMeta[]> {
  const objects = await listAudioObjects();
  return deriveCatalog(objects.map(({ key }) => key));
}

/**
 * When each track was last written to the bucket, keyed by album. Backs the
 * sitemap's `lastModified` so it reflects the catalog instead of a date
 * someone has to remember to bump.
 */
export async function albumLastModified(): Promise<Map<string, Date>> {
  const objects = await listAudioObjects();
  const newest = new Map<string, Date>();

  for (const { key, lastModified } of objects) {
    if (!lastModified) continue;
    const { album } = splitKey(key);
    const current = newest.get(album);
    if (!current || lastModified > current) newest.set(album, lastModified);
  }

  return newest;
}

/**
 * Attaches the streaming endpoint to each track. The URL points at our own
 * route rather than at R2, so it never expires and playback can't break in a
 * tab that has been open a while — the route re-signs per request, after
 * re-checking access.
 */
export function toPlayable(songs: SongMeta[]): Song[] {
  return songs.map((song) => ({
    ...song,
    url: `/api/stream?key=${encodeURIComponent(song.key)}`,
  }));
}

/**
 * A presigned URL for a single object, valid just long enough to be
 * followed immediately. Both callers re-check the requester's access level
 * first — this grants direct file access to whoever holds the result.
 *
 * The extension guard is a security boundary, not a convenience: without it
 * a caller could name any object in the bucket, including `contacts/*.json`.
 */
async function signObject(
  key: string,
  { attachment }: { attachment: boolean },
): Promise<string | null> {
  if (!isAudioKey(key)) return null;

  const filename = key.slice(key.lastIndexOf('/') + 1);
  return getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      ...(attachment
        ? { ResponseContentDisposition: `attachment; filename="${filename}"` }
        : {}),
    }),
    { expiresIn: attachment ? 300 : 120 },
  );
}

/** Playback URL for a member. Followed immediately by the audio element. */
export function getStreamUrl(key: string): Promise<string | null> {
  return signObject(key, { attachment: false });
}

/** Download URL for an admin, served as a file attachment. */
export function getDownloadUrl(key: string): Promise<string | null> {
  return signObject(key, { attachment: true });
}
