import mongoose from 'mongoose';
import logger from './logger';

let connectionURL = process.env.DB_CONNECTION_URL || '';
connectionURL = connectionURL.replace('<username>', process.env.DB_USERNAME || '');
connectionURL = connectionURL.replace('<password>', process.env.DB_PASSWORD || '');

const connectDB = async () => {
  if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'test') {
    const connectionURL = 'mongodb://my-mongodb-container:27017/testdb';
    await mongoose.connect(connectionURL);
    logger.info('Test Database Connected!');
  } else {
    await mongoose.connect(connectionURL, { dbName: process.env.DB_NAME });
    logger.info('Database Connected!');
  }
};

export default connectDB;
