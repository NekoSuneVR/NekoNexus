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

import crypto from 'crypto';

export default class RijndaelCryptoProvider {
  private key: Buffer;
  private iv: Buffer;

  constructor(key: Buffer, salt: Buffer, iv: Buffer) {
    this.key = crypto.pbkdf2Sync(key, salt, 1000, 32, 'sha1');
    this.iv = iv;
  }

  encrypt(clearText: Buffer) {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
    return Buffer.concat([cipher.update(clearText), cipher.final()]);
  }

  decrypt(cipherText: Buffer) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
    return Buffer.concat([decipher.update(cipherText), decipher.final()]);
  }
}
