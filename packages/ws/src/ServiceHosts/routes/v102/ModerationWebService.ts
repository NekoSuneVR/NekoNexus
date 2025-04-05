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

import { ApiVersion } from '@/utils/enums';
import { Int32Proxy, StringProxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import BaseWebService from '../BaseWebService';

export default class ModerationWebService extends BaseWebService {
  static get ServiceName(): string {
    return 'ModerationWebService';
  }
  static get ServiceVersion(): string {
    return ApiVersion.Legacy102;
  }
  // protected static get ServiceInterface(): string { return 'IModerationWebServiceContract'; }

  static async BanPermanently(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const sourceCmid = Int32Proxy.Deserialize(bytes);
      const targetCmid = Int32Proxy.Deserialize(bytes);
      const applicationId = Int32Proxy.Deserialize(bytes);
      const ip = StringProxy.Deserialize(bytes);

      this.debugEndpoint('BanPermanently', sourceCmid, targetCmid, applicationId, ip);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('BanPermanently', e);
    }

    return null;
  }
}
