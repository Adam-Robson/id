import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Song } from "@/types/song";
import type { SongMeta } from "@/types/song-meta";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_API,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "",
  },
});

const AUDIO_EXTENSIONS = /\.(mp3|wav|flac|ogg|m4a|aac)$/i;

function parseSongMeta(key: string): { title: string; album: string } {
  const slashIdx = key.lastIndexOf("/");
  if (slashIdx !== -1) {
    const dirPath = key.slice(0, slashIdx);
    const album = (dirPath.split("/").filter(Boolean).pop() ?? dirPath).replace(
      /[-_]/g,
      " ",
    );
    const filename = key
      .slice(slashIdx + 1)
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ");
    return { album, title: filename };
  }
  return {
    album: "Singles",
    title: key.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
  };
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}

export async function saveContact(
  data: Omit<ContactSubmission, "id" | "submittedAt">,
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
      ContentType: "application/json",
    }),
  );

  return submission;
}

async function listAudioKeys(): Promise<string[]> {
  const list = await r2.send(
    new ListObjectsV2Command({ Bucket: process.env.BUCKET_NAME }),
  );

  return (list.Contents ?? [])
    .map((obj) => obj.Key)
    .filter((key): key is string => key != null)
    .filter((key) => AUDIO_EXTENSIONS.test(key));
}

/**
 * Track metadata only — no signed URL. Safe to expose to any visitor,
 * signed in or not, since it grants no access to the underlying files.
 */
export async function listSongs(): Promise<SongMeta[]> {
  const keys = await listAudioKeys();
  return keys.map((key) => ({ key, ...parseSongMeta(key) }));
}

/**
 * Track metadata plus a short-lived presigned streaming URL for each song.
 * The URL is a bearer credential, so callers must only invoke this once
 * the visitor's access level has already been checked.
 */
export async function getPlayableSongs(): Promise<Song[]> {
  const songs = await listSongs();
  return Promise.all(
    songs.map(async (song) => ({
      ...song,
      url: await getSignedUrl(
        r2,
        new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: song.key,
        }),
        { expiresIn: 3600 },
      ),
    })),
  );
}

/**
 * A presigned URL for downloading a single track as an attachment. Callers
 * must verify the requester is an admin before calling this — it grants
 * direct file access to whoever holds the returned URL.
 */
export async function getDownloadUrl(key: string): Promise<string | null> {
  if (!AUDIO_EXTENSIONS.test(key)) return null;

  const filename = key.slice(key.lastIndexOf("/") + 1);
  return getSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    }),
    { expiresIn: 300 },
  );
}
