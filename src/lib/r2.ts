import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_API,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const AUDIO_EXTENSIONS = /\.(mp3|wav|flac|ogg|m4a|aac)$/i;

export async function getSongs() {
  const list = await r2.send(
    new ListObjectsV2Command({ Bucket: process.env.BUCKET_NAME })
  );

  const keys = (list.Contents ?? [])
    .map((obj) => obj.Key!)
    .filter((key) => AUDIO_EXTENSIONS.test(key));

  return Promise.all(
    keys.map(async (key) => ({
      key,
      title: key.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      url: await getSignedUrl(
        r2,
        new GetObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: key }),
        { expiresIn: 3600 }
      ),
    }))
  );
}
