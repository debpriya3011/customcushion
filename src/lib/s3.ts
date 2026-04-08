import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const uploadToS3 = async (buffer: Buffer, filename: string, mimeType: string): Promise<string> => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) throw new Error('AWS_S3_BUCKET_NAME is not configured');

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  // Return the CloudFront CDN URL if configured, otherwise fall back to direct S3 URL
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
  if (cdnUrl) {
    return `${cdnUrl.replace(/\/$/, '')}/${filename}`;
  }
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
};

/** Helper – returns true for both S3 and CloudFront URLs owned by this app */
export const isStoredUrl = (url: string): boolean =>
  url.includes('amazonaws.com') || url.includes('cloudfront.net');

export const deleteFromS3 = async (fileUrl: string) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName || !fileUrl) return;

  try {
    // Works for both:
    //   https://bucket.s3.us-east-1.amazonaws.com/uploads/file.jpg  → key = uploads/file.jpg
    //   https://d2j7elbn0mue4p.cloudfront.net/uploads/file.jpg       → key = uploads/file.jpg
    const urlParts = new URL(fileUrl);
    const key = urlParts.pathname.substring(1); // remove leading slash

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
  }
};
