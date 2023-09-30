import multer from 'multer';

const uploadFile = multer();

export const handleFileUpload = uploadFile.single('file');
