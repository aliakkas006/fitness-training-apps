import upload from '../lib/upload';

const fields = [
  {
    name: 'avatar',
    maxCount: 1,
  },
  {
    name: 'docs',
    maxCount: 3,
  },
  {
    name: 'videos',
    maxCount: 1,
  },
];

const handleUpload = upload.fields(fields);

export default handleUpload;
