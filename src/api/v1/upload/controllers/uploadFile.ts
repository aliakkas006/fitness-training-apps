import { Request, Response, NextFunction } from 'express';
import { s3Uploader } from '../../../../lib/s3bucket';
import logger from '../../../../config/logger';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];

    const uploadPromises = files.map(async (file) => {
      const data = await s3Uploader(file.buffer, file.originalname);
      logger.info(data);
      return data;
    });

    const results = await Promise.all(uploadPromises);

    res.json({ data: results });
  } catch (err) {
    next(err);
  }
};

export default uploadFile;
