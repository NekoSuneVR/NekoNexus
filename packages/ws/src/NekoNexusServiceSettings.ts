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

import type { ServerType } from '@/ServiceHosts/WebSocket';
import DiscordSettings from '@/discord/DiscordSettings';
import { Log } from '@/utils';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

class ServerPassPhrase {
  Name: string;
  Type: ServerType;
  Id: string;
  Passphrase: string;
}

export class DatabaseSettings {
  Server: string;
  Type: string = 'mysql';
  Port: number = 3306;
  Username: string;
  Password: string;
  DatabaseName: string = 'nekonexus';
}

export class NekoNexusServiceSettings {
  Hostname: string = '127.0.0.1';

  WebServicePort: number = 8080;
  FileServerPort: number = 8081;
  SocketPort: number = 8082;

  DatabaseSettings: DatabaseSettings = new DatabaseSettings();

  WebServicePrefix: string = 'UberStrike.DataCenter.WebService.CWS.';
  WebServiceSuffix: string = 'Contract.svc';
  EncryptionInitVector: string = 'aaaaBBBBccccDDDD'; // Must be 16 characters
  EncryptionPassPhrase: string = 'mysupersecretpassphrase';
  ServerCredentials: ServerPassPhrase[] = [];

  FileServerRoot: string = 'wwwroot';

  /**
   * @deprecated Use a reverse proxy to provide SSL encryption
   */
  EnableSSL: boolean = false;

  /**
   * @deprecated Use a reverse proxy to provide SSL encryption
   */
  SSLCertificateName: string = '';

  DiscordSettings: DiscordSettings = new DiscordSettings();

  constructor(path: string) {
    if (!fs.existsSync(path)) {
      Log.warn(`No config file found at ${path}, using fallback config.`);
      return;
    }

    try {
      const settings = YAML.parse(fs.readFileSync(path, 'utf-8'));

      Object.assign(this, settings);
    } catch (error: any) {
      Log.error('There was an error parsing the settings file.', error);
    }
  }
}

export default new NekoNexusServiceSettings(path.join(process.cwd(), 'NekoNexus.Settings.WebServices.yml'));
