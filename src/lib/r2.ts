import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export async function getSongs() {
  const list = await r2.send(
    new ListObjectsV2Command({ Bucket: process.env.BUCKET_NAME }),
  );

  const keys = (list.Contents ?? [])
    .map((obj) => obj.Key)
    .filter((key): key is string => key != null)
    .filter((key) => AUDIO_EXTENSIONS.test(key));

  return Promise.all(
    keys.map(async (key) => ({
      key,
      ...parseSongMeta(key),
      url: await getSignedUrl(
        r2,
        new GetObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: key }),
        { expiresIn: 3600 },
      ),
    })),
  );
}
