import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import "dotenv/config";
import path from "path";

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string;

/**
 * Upload a single file to S3
 * @param file - Express Multer File object
 * @param folder - Optional folder path in S3 bucket
 * @returns S3 file key (URL path)
 */
export async function uploadToS3(
  file: Express.Multer.File,
  folder: string = "uploads"
): Promise<string> {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Return the S3 URL or just the key
    return fileName;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}

/**
 * Upload multiple files to S3
 * @param files - Array of Express Multer File objects
 * @param folder - Optional folder path in S3 bucket
 * @returns Array of S3 file keys
 */
export async function uploadMultipleToS3(
  files: Express.Multer.File[],
  folder: string = "uploads"
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadToS3(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Delete a file from S3
 * @param fileKey - The S3 file key to delete
 */
export async function deleteFromS3(fileKey: string): Promise<void> {
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
  };

  try {
    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error("Failed to delete file from S3");
  }
}

/**
 * Delete multiple files from S3
 * @param fileKeys - Array of S3 file keys to delete
 */
export async function deleteMultipleFromS3(fileKeys: string[]): Promise<void> {
  const deletePromises = fileKeys.map((key) => deleteFromS3(key));
  await Promise.all(deletePromises);
}

/**
 * Get the full S3 URL for a file
 * @param fileKey - The S3 file key
 * @returns Full S3 URL
 */
export function getS3Url(fileKey: string): string {
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${fileKey}`;
}
