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

import fs from 'fs';
import moment from 'moment';
import path from 'path';
import YAML from 'yaml';

const FILE_NAME = 'updates';
const FILE_SUFFIX = 'yml';
const VERSION = '2.1.2.1';

const CHANNELS = ['stable', 'beta'];
const PLATFORMS: string[] = ['win', 'darwin', 'universal'];

const OPTIONAL_FILES: { [key: string]: any[] } = {
  win: [
    {
      filename: 'NekoNexus.Client.DiscordRPC.exe',
      localPath: 'UberStrike_Data/Plugins',
    },
  ],
};

const REMOVED_FILES: { [key: string]: any[] } = {
  universal: [
    {
      filename: 'uberbeat.dll',
      localPath: 'UberStrike_Data/Plugins',
    },
  ],
};

export class UpdateGenerator {
  static listFiles(directory: string, extensions: string[] = ['.exe', '.dll', '.unity3d', '']): string[] {
    const files: string[] = [];

    for (const file of (fs.readdirSync(directory, { recursive: true }) as string[]).sort()) {
      if (fs.statSync(path.join(directory, file)).isFile() && extensions.some((ext) => file.endsWith(ext))) {
        files.push(this.normalizePath(path.join(directory, file)));
      }
    }

    return files;
  }

  static md5(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = new Bun.CryptoHasher('md5');
      const stream = fs.createReadStream(path);

      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  static sha256(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = new Bun.CryptoHasher('sha256');
      const stream = fs.createReadStream(path);

      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  static sha512(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = new Bun.CryptoHasher('sha512');
      const stream = fs.createReadStream(path);

      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  static normalizePath(pth: string): string {
    return path.normalize(pth).split(path.sep).join('/');
  }

  static async generate(outputDir: string): Promise<void> {
    console.log('Generating V2 updates...');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    process.chdir(outputDir);

    const buildDate = moment().format('YYMMDD-HHmm');
    const build = `4.7.1-${buildDate}`;

    for (const channel of CHANNELS) {
      if (fs.existsSync(channel)) {
        const updates: { [key: string]: any } = {
          version: VERSION,
          build,
          channel,
          platforms: {},
        };

        for (const platform of PLATFORMS) {
          const _path = path.join(process.cwd(), channel, platform);

          if (fs.existsSync(_path)) {
            const platformUpdates: { [key: string]: any } = {
              platform,
              files: [],
              removedFiles: [],
            };

            const files = this.listFiles(_path);

            for (const file of files) {
              const localPath = this.normalizePath(path.dirname(path.relative(_path, file)));
              const remotePath = this.normalizePath(path.dirname(path.relative(process.cwd(), file)));

              const fileDef = {
                filename: path.basename(file),
                description: '',
                localPath,
                remotePath,
                filesize: fs.statSync(file).size,
                md5sum: await this.md5(file),
                sha256: await this.sha256(file),
                sha512: await this.sha512(file),
                optional: false,
              };

              if (OPTIONAL_FILES[platform]?.some((_) => _.filename === fileDef.filename)) {
                fileDef.optional = true;
              }

              platformUpdates.files.push(fileDef);
            }

            if (platform in REMOVED_FILES) platformUpdates.removedFiles = REMOVED_FILES[platform];

            updates.platforms[platform] = platformUpdates;
          }
        }

        fs.writeFileSync(
          path.join(outputDir, `${channel}/${FILE_NAME}.${FILE_SUFFIX}`),
          YAML.stringify(updates, { sortMapEntries: false }),
        );
      }
    }

    console.log('OK');
  }
}

export class FallbackUpdateGenerator extends UpdateGenerator {
  static async generate(outputDir: string): Promise<void> {
    console.log('Generating pre-V2 updates...');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    process.chdir(outputDir);

    const buildDate = moment().format('YYMMDD-HHmm');
    const build = `4.7.1-${buildDate}`;

    for (const channel of CHANNELS) {
      if (fs.existsSync(path.join(process.cwd(), 'v2', channel))) {
        const updates: { [key: string]: any } = {
          platforms: [],
        };

        for (const platform of PLATFORMS) {
          const _path = path.join(process.cwd(), 'v2', channel, platform);
          const _start = path.join('./v2', channel, platform, 'UberStrike_Data');

          if (fs.existsSync(_path)) {
            const platformUpdates: { [key: string]: any } = {
              platform: platform === 'universal' ? platform : `${platform}32`,
              version: VERSION,
              build,
              files: [],
              removedFiles: [],
            };

            const files = this.listFiles(_path);

            for (const file of files) {
              const localPath = this.normalizePath(path.dirname(path.relative(_start, file)));
              const remotePath = this.normalizePath(path.dirname(path.relative(process.cwd(), file)));

              const fileDef = {
                filename: path.basename(file),
                description: '',
                localPath,
                remotePath,
                filesize: fs.statSync(file).size,
                md5sum: await this.md5(file),
                sha256: await this.sha256(file),
                sha512: await this.sha512(file),
              };

              platformUpdates.files.push(fileDef);
            }

            if (platform in REMOVED_FILES)
              platformUpdates.removedFiles = REMOVED_FILES[platform].map((_) => ({
                ..._,
                localPath: path.relative('UberStrike_Data', _.localPath),
              }));

            updates.platforms.push(platformUpdates);
          }
        }

        fs.writeFileSync(
          path.join(outputDir, `${FILE_NAME}-${channel}.yaml`),
          YAML.stringify(updates, { sortMapEntries: false }),
        );
      }
    }

    console.log('OK');
  }
}
