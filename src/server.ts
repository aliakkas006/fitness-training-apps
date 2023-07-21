import http from 'http';
import app from './app';
import mongoose from 'mongoose';

const port = process.env.PORT || 4000;
const mongoDBUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/fitness-training-apps-DB';

const startServer = async () => {
  try {
    await mongoose.connect(mongoDBUrl);
    console.log('Database connected!');

    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Express server is listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

startServer();
