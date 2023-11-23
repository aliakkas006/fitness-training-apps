import multer from 'multer';
import { badRequest } from '../../utils/error';

const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter: (_req, file, done) => {
    const fileName = file.mimetype;
    const fieldName = file.fieldname;

    if ((fieldName === 'avatar' && fileName === 'image/jpeg') || fileName === 'image/png') {
      done(null, true);
      return;
    } else if (fieldName === 'docs' && fileName === 'application/pdf') {
      done(null, true);
      return;
    } else if (fieldName === 'videos' && fileName === 'video/mp4') {
      done(null, true);
      return;
    } else done(badRequest('File type not supported!'));
  },
});

export default upload;

/* 
const storage = multer.diskStorage({
  destination: (_req, _file, done) => {
    done(null, './uploads');
  },
  filename: (req, file, done) => {
    const fileExtension = path.extname(file.originalname);
    const fileName =
      file.originalname.replace(fileExtension, '').toLocaleLowerCase().split(' ').join('-') +
      '-' +
      uuidv4() +
      fileExtension;
    done(null, fileName);
  },
});
*/
