/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
  private static maxLogLevel: LogLevel | undefined;

  static set MaxLogLevel(level: LogLevel | undefined) {
    this.maxLogLevel = level;
  }

  static success(message: any): void {
    this.write(message, LogLevel.OK);
  }

  static info(message: any): void {
    this.write(message, LogLevel.INFO);
  }

  static warn(message: any): void {
    this.write(message, LogLevel.WARN);
  }

  static error(message: any, error?: any): void {
    this.write(message, LogLevel.ERROR, error);
  }

  static fatal(message: any): void {
    this.write(message, LogLevel.FATAL);
  }

  static debug(message: any): void {
    this.write(message, LogLevel.DEBUG);
  }

  static write(message: any, level: LogLevel = LogLevel.INFO, error?: any): void {
    if (this.maxLogLevel === undefined || level <= this.maxLogLevel) {
      logger.log(LogLevel[level], message);
    }

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
