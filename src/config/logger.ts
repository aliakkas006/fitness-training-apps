import { createLogger, format, transports } from 'winston';
import { TransformableInfo } from 'logform';

const level = process.env.LOG_LEVEL || 'debug';

const formatParams = ({ timestamp, level, message, ...args }: TransformableInfo): string => {
  const ts = timestamp.slice(0, 19).replace('T', ' ');

  return `${ts} [${level}]: ${message} ${Object.keys(args).length > 0 ? JSON.stringify(args) : ''}`;
};

// development format
const devFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

// production format
const prodFormat = format.combine(format.timestamp(), format.align(), format.printf(formatParams));
let logger: any = null;

if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production') {
  logger = createLogger({
    level,
    format: prodFormat,
    transports: [
      new transports.File({ filename: 'src/logs/error.log', level: 'error' }),
      new transports.File({ filename: 'src/logs/combined.log' }),
    ],
  });
} else {
  logger = createLogger({
    level,
    format: devFormat,
    transports: [new transports.Console()],
  });
}

export default logger;
