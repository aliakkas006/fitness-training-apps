import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

// Start the in-memory MongoDB server
export const connectTestDB = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
};

// Close the database connection and stop the in-memory MongoDB server
export const disconnectTestDB = async (): Promise<void> => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
};
