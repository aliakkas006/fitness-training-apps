import { createLogger } from 'winston';
import 'winston-daily-rotate-file';
import { consoleTransport, errorFileTransport, esTrnasport, infoFileTransport } from './transports';

let logger: any= null;

if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
  logger = createLogger({
    transports: [infoFileTransport, errorFileTransport, esTrnasport],
  });
} else {
  logger = createLogger({
    transports: [consoleTransport],
  });
}

export default logger;
