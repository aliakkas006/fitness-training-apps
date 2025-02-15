import S3 from 'aws-sdk/clients/s3';
import path from 'path';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client with environment variables
const s3bucket = new S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
  s3ForcePathStyle: true,
});

/**
 * Uploads a file to S3.
 * @param {Express.Multer.File} file - The file to upload.
 * @param {string} fileName - The desired file name (optional). If not provided, a unique name will be generated.
 * @returns {Promise<S3.ManagedUpload.SendData>} - The result of the S3 upload operation.
 */
export const s3Uploader = (
  file: Express.Multer.File,
  fileName?: string
): Promise<S3.ManagedUpload.SendData> => {
  // Generate a unique file name if not provided
  const fileExtension = path.extname(file.originalname);
  const uniqueFileName =
    fileName ||
    `${file.originalname
      .replace(fileExtension, '')
      .toLowerCase()
      .split(' ')
      .join('-')}-${uuidv4()}${fileExtension}`;

  // S3 upload parameters
  const params: S3.PutObjectRequest = {
    Bucket: process.env.BUCKET_NAME || '',
    Key: uniqueFileName,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype,
  };

  // Upload the file to S3
  return s3bucket.upload(params).promise();
};

/**
 * Retrieves a file stream from S3.
 * @param {string} key - The S3 object key (file name).
 * @returns {Readable} - A readable stream of the file content.
 */
export const getFileStream = (key: string): Readable => {
  const params: S3.GetObjectRequest = {
    Bucket: process.env.BUCKET_NAME || '',
    Key: key,
  };

  // Return a readable stream for the file
  return s3bucket.getObject(params).createReadStream();
};
