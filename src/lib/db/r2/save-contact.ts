import type { ContactSubmission } from '@/lib/types/contact-submission';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/db/r2/s3';
/**
 * Saves a contact form submission to the R2 (S3-compatible) database.
 * @param data The contact form submission data, excluding the ID and submission timestamp.
 * @returns The complete contact submission, including the generated ID and submission timestamp.
 */
export async function saveContact(
  data: Omit<ContactSubmission, 'id' | 'submittedAt'>,
) {
  const submission: ContactSubmission = {
    id: crypto.randomUUID(),
    ...data,
    submittedAt: new Date().toISOString(),
  };

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `contacts/${submission.submittedAt}_${submission.id}.json`,
      Body: JSON.stringify(submission),
      ContentType: 'application/json',
    }),
  );

  return submission;
}
