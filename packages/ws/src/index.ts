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

import packageJson from '@/../package.json';
import { program } from 'commander';
import path from 'path';
import seedrandom from 'seedrandom';
import ParadiseService from './ParadiseService';
import { FallbackUpdateGenerator, Log, LogLevel, UpdateGenerator } from './utils';

const r = seedrandom(String(new Date().getTime()));

// #region Extensions
// eslint-disable-next-line no-extend-native
Array.prototype.writeTo = function (stream: number[]) {
  for (const _ of this) {
    stream.push(_);
  }
};

Math.clamp = function (value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
};

Math.randomInt = function (min = 1, max = 2147483647) {
  return Math.floor(r() * (max - min) + min);
};
// #endregion

program
  .name('paradise')
  .description(packageJson.description)
  .version(packageJson.version)
  .helpOption('--help', 'Displays this help text')
  .helpCommand(false)
  .option('--log-level <LEVEL>', 'Set the log level', (value: string) => {
    if (value.toUpperCase() in LogLevel) return LogLevel[value.toUpperCase() as keyof typeof LogLevel];
    return -1;
  })
  .option('--no-service', 'Disable service host')
  .option('--no-prompt', 'Disable console prompt')
  .addHelpText('afterAll', '\nRun without any parameters to launch the Web Services.')
  .action(async (options, command) => {
    if (options.logLevel >= 0) Log.MaxLogLevel = options.logLevel;

    process.stdout.write('\x1bc');
    ParadiseService.Instance.Run({
      serviceHost: options.service,
      prompt: options.prompt,
    });
  });

program
  .command('seed')
  .description('Initialize the database with default data (run once before first start)')
  .action(async () => {
    const { default: runSeed } = await import('./seed/seed');
    await runSeed();
  });

program
  .command('gen-updates')
  .description('Generates YAML definitions for automatic game updates')
  .option('--fallback', 'Generate fallback definitions for pre-v2 update clients')
  .option('--dir <path>', 'wwwroot base directory to scan/write (defaults to ./wwwroot)')
  .action((options, command) => {
    const base = options.dir ? path.resolve(options.dir) : path.join(process.cwd(), 'wwwroot');
    if (!options.fallback) {
      UpdateGenerator.generate(path.join(base, 'updates/v2'));
    } else {
      FallbackUpdateGenerator.generate(path.join(base, 'updates/'));
    }
  });

program.parse();
