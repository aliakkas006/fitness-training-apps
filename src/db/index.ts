import mongoose from 'mongoose';

let connectionURL = process.env.DB_CONNECTION_URL || '';
connectionURL = connectionURL.replace('<username>', process.env.DB_USERNAME || '');
connectionURL = connectionURL.replace('<password>', process.env.DB_PASSWORD || '');

const connectDB = async () => {
  await mongoose.connect(connectionURL, { dbName: process.env.DB_NAME });
  console.log('Database Connected!');
};

export default connectDB;
