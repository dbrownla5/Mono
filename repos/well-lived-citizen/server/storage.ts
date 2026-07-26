import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.S3_BUCKET || "wlc-uploads";
const REGION = process.env.S3_REGION || "us-east-1";
const ENDPOINT = process.env.S3_ENDPOINT;
const ACCESS_KEY = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

function getClient(): S3Client {
  return new S3Client({
    region: REGION,
    ...(ENDPOINT ? { endpoint: ENDPOINT, forcePathStyle: true } : {}),
    ...(ACCESS_KEY && SECRET_KEY
      ? { credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY } }
      : {}),
  });
}

/**
 * Upload a file buffer to S3.
 * Returns { key, url } where url is the /manus-storage/ path for frontend use.
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const client = getClient();
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: relKey,
    Body: data,
    ContentType: contentType,
  });
  await client.send(command);
  return {
    key: relKey,
    url: `/manus-storage/${relKey}`,
  };
}

/**
 * Get a presigned GET URL for a stored file (expires in 1 hour by default).
 */
export async function storageGet(
  relKey: string,
  expiresIn = 3600
): Promise<{ key: string; url: string }> {
  const client = getClient();
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: relKey });
  const url = await getSignedUrl(client, command, { expiresIn });
  return { key: relKey, url };
}
