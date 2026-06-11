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

import NekoNexusServiceSettings from '@/NekoNexusServiceSettings';
import { Log } from '@/utils';
import RijndaelCryptographyPolicy from '@/utils/RijndaelCryptographyPolicy';

export default abstract class BaseWebService {
  static get ServiceName(): string | null {
    return null;
  }
  static get ServiceVersion(): string | null {
    return null;
  }
  static get ServiceInterface(): string | null {
    return `I${this.ServiceName}Contract`;
  }

  static readonly CryptoPolicy = new RijndaelCryptographyPolicy();

  static get EncryptionPassPhrase(): string {
    return NekoNexusServiceSettings.EncryptionPassPhrase as string;
  }

  static get EncryptionInitVector(): string {
    return NekoNexusServiceSettings.EncryptionInitVector as string;
  }

  static debugEndpoint(serviceMethod: String, ...args: any): void {
    Log.debug(
      `${this.ServiceName}(${this.ServiceVersion}):${serviceMethod} {\n\t${args.map((_: any) => `[${typeof _}] ${_}`).join('\n\t')}\n}`,
    );
  }

  protected static handleEndpointError(serviceMethod: string, e: any): void {
    Log.error(`Failed to handle ${this.ServiceName}:${serviceMethod}: ${e.message}`);
    console.error(e);
  }

  static isEncrypted(data: number[]): boolean {
    try {
      this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector);
      return true;
    } catch (error) {
      return false;
    }
  }
}
