import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

class UploadService {
  private configCloudinary() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  public async streamUpload({ file }: any) {
    this.configCloudinary();
    
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }
}

const uploadService = new UploadService();

export default uploadService;
