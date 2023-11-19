import { format, transports } from 'winston';
import { TransformableInfo } from 'logform';
import { ElasticsearchTransport } from 'winston-elasticsearch';

// Format params
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

// Console trnasport
export const consoleTransport = new transports.Console({
  level: 'info',
  format: devFormat,
});

// File transport
const fileTransport = (level = 'info', filename = 'logs/info/info-%DATE%.log') => {
  return new transports.DailyRotateFile({
    level: level,
    format: prodFormat,
    filename: filename,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '15d',
  });
};

export const infoFileTransport = fileTransport('info', 'logs/info/info-%DATE%.log');
export const errorFileTransport = fileTransport('error', 'logs/error/error-%DATE%.log');

// ElasticSearch transport
export const esTrnasport = new ElasticsearchTransport({
  level: 'http',
  clientOpts: { node: 'http://localhost:9200' },
  indexPrefix: 'logs-express',
  indexSuffixPattern: 'YYYY-MM-DD',
});

/* 
// fired when a log file is created
fileTransport().on('new', (filename) => {});

// fired when a log file is rotated
fileTransport().on('rotate', (oldFilename, newFilename) => {});

// fired when a log file is archived
fileTransport().on('archive', (zipFilename) => {});

// fired when a log file is deleted
fileTransport().on('logRemoved', (removedFilename) => {}); 
*/
