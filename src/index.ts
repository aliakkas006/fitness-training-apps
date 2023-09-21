import 'dotenv/config';
import http from 'http';
import app from './app';
import connectDB from './config/connectDB';
import logger from './config/logger';

const server: http.Server = http.createServer(app);
const port = process.env.PORT || 4000;

const main = async () => {
  try {
    // database connection
    await connectDB();

    // server connection
    server.listen(port, async () => {
      logger.info(`Express server is listening at http://localhost:${port}`);
    });
  } catch (err: any) {
    logger.error('Database error ->', err.message);
  }
};

main();
