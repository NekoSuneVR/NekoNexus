import chalk from 'chalk';
import util from 'util';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export enum LogLevel {
  NONE,
  OK,
  INFO,
  WARN,
  ERROR,
  FATAL,
  DEBUG,
}

const logger = winston.createLogger({
  level: Bun.env.NODE_ENV === 'production' ? 'INFO' : 'DEBUG',
  levels: Object.keys(LogLevel)
    .filter((key) => !(parseInt(key, 10) >= 0))
    .reduce((acc: any, cur: any) => {
      acc[cur] = LogLevel[cur];
      return acc;
    }, {}),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.printf(
          ({ timestamp, level, message }) =>
            `[${timestamp}] [${level}] ${level.indexOf('FATAL') >= 0 ? chalk.red(message) : message}`,
        ),
      ),
    }),
    new DailyRotateFile({
      filename: 'Paradise.WebServices-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '512k',
      maxFiles: '10d',
      dirname: 'logs',
      createSymlink: true,
      symlinkName: 'Paradise.WebServices.log',
      options: {
        flags: 'w',
      },
      auditFile: './logs/.audit.json',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level}] ${message}`),
      ),
    }),
  ],
});

winston.addColors({
  NONE: '',
  OK: 'green',
  INFO: 'blue',
  WARN: 'yellow',
  ERROR: 'red',
  FATAL: 'redBG white',
  DEBUG: 'magenta',
});

export default class Log {
  static success(message: string): void {
    this.write(message, LogLevel.OK);
  }

  static info(message: string): void {
    this.write(message, LogLevel.INFO);
  }

  static warn(message: string): void {
    this.write(message, LogLevel.WARN);
  }

  static error(message: string, error?: any): void {
    this.write(message, LogLevel.ERROR, error);
  }

  static fatal(message: string): void {
    this.write(message, LogLevel.FATAL);
  }

  static debug(message: string): void {
    if (process.env.NODE_ENV !== 'production') {
      this.write(message, LogLevel.DEBUG);
    }
  }

  static write(message: string, level: LogLevel = LogLevel.INFO, error?: any): void {
    logger.log(LogLevel[level], message);

    if (error) console.error(error);
  }

  static inspect(object: any): void {
    console.log(
      util.inspect(object, {
        showHidden: false,
        depth: null,
        colors: true,
        sorted: true,
        compact: false,
      }),
    );
  }
}
