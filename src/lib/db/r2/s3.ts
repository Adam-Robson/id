import {
  S3Client,
} from '@aws-sdk/client-s3';

/**
 * R2 (S3-compatible) database utility functions for handling song objects.
 */
export const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_API,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.SECRET_ACCESS_KEY ?? '',
  },
   forcePathStyle: true,
});
