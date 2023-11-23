import S3 from 'aws-sdk/clients/s3';
import path from 'path';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';

const s3bucket = new S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
  s3ForcePathStyle: true,
});

export const s3Uploader = (file: any, fileName: string) => {
  const fileExtension = path.extname(file.originalname);
  fileName =
    file.originalname.replace(fileExtension, '').toLocaleLowerCase().split(' ').join('-') +
    '-' +
    uuidv4() +
    fileExtension;

  const params: any = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: file,
    ACL: 'public-read',
  };

  return s3bucket.upload(params).promise();
};

export const getFileStream = (Key: string): Readable => {
  return s3bucket
    .getObject({
      Bucket: process.env.BUCKET_NAME || '',
      Key,
    })
    .createReadStream();
};
