import chalk from 'chalk';
import moment from 'moment';
import util from 'util';

export enum LogLevel {
  NONE,
  OK,
  INFO,
  WARN,
  ERROR,
  FATAL,
  DEBUG,
}

export default class Log {
  private static levelColors = {
    [LogLevel.NONE]: chalk.reset,
    [LogLevel.OK]: chalk.green,
    [LogLevel.INFO]: chalk.blue,
    [LogLevel.WARN]: chalk.yellow,
    [LogLevel.ERROR]: chalk.red,
    [LogLevel.FATAL]: chalk.bgRed.white,
    [LogLevel.DEBUG]: chalk.magentaBright,
  };

  private static defaultTags = {
    [LogLevel.NONE]: 'LOG',
    [LogLevel.OK]: 'OK',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR',
    [LogLevel.FATAL]: 'FATAL',
    [LogLevel.DEBUG]: 'DEBUG',
  };

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
    this.write(message, LogLevel.ERROR, undefined, error);
  }

  static fatal(message: string): void {
    this.write(message, LogLevel.FATAL);
  }

  static debug(message: string): void {
    if (process.env.NODE_ENV !== 'production') {
      this.write(message, LogLevel.DEBUG);
    }
  }

  static write(message: string, level: LogLevel = LogLevel.INFO, tag?: string, error?: any): void {
    if (level === LogLevel.FATAL) message = chalk.red(message);
    console.log(
      `[${moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS')}] [${(this.levelColors[level] || chalk.reset)(tag ?? this.defaultTags[level])}] ${message}`,
    );

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
