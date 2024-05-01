/* eslint-disable no-use-before-define */
import crypto, { Cipher } from 'crypto';
import seedrandom from 'seedrandom';

function passwordDeriveBytes(password: string, salt: Buffer, iterations: number, len: number, hashAlgorithm: string) {
  let baseValue = Buffer.concat([Buffer.from(password, 'utf8'), salt]);
  baseValue = crypto.createHash(hashAlgorithm).update(baseValue).digest();

  for (let i = 1; i < iterations - 1; i++) {
    baseValue = crypto.createHash(hashAlgorithm).update(baseValue).digest();
  }

  const key = Buffer.alloc(len);
  let keyLength = 0;
  let prefixCounter = 0;

  while (keyLength < len) {
    if (prefixCounter > 999) throw new Error('Too many bytes requested');

    let hashBase = baseValue;

    if (prefixCounter !== 0) {
      const prefix = Buffer.from(String(prefixCounter), 'ascii');
      hashBase = Buffer.concat([prefix, hashBase]);
    }

    prefixCounter++;

    const hash = crypto.createHash(hashAlgorithm).update(hashBase).digest();
    const hashBytes = Math.min(hash.length, len - keyLength);

    hash.copy(key, keyLength, 0, hashBytes);
    keyLength += hashBytes;
  }

  return key;
}

export default class RijndaelCipher {
  private static DEFAULT_HASH_ALGORITHM: string = 'sha1';
  private static DEFAULT_KEY_SIZE: number = 256;
  private static MAX_ALLOWED_SALT_LEN: number = 255;
  private static MIN_ALLOWED_SALT_LEN: number = 4;
  private static DEFAULT_MIN_SALT_LEN: number = RijndaelCipher.MIN_ALLOWED_SALT_LEN;
  private static DEFAULT_MAX_SALT_LEN: number = 8;

  private minSaltLen: number = -1;
  private maxSaltLen: number = -1;

  private encryptor: Cipher;
  private decryptor: Cipher;

  constructor(
    passPhrase: string,
    initVector: string | null = null,
    minSaltLen: number = -1,
    maxSaltLen: number = -1,
    keySize: number = -1,
    hashAlgorithm: string | null = null,
    saltValue: string | null = null,
    passwordIterations: number = 1,
  ) {
    if (minSaltLen < RijndaelCipher.MIN_ALLOWED_SALT_LEN) {
      this.minSaltLen = RijndaelCipher.DEFAULT_MIN_SALT_LEN;
    } else {
      this.minSaltLen = minSaltLen;
    }
    if (maxSaltLen < 0 || maxSaltLen > RijndaelCipher.MAX_ALLOWED_SALT_LEN) {
      this.maxSaltLen = RijndaelCipher.DEFAULT_MAX_SALT_LEN;
    } else {
      this.maxSaltLen = maxSaltLen;
    }
    if (keySize <= 0) {
      keySize = RijndaelCipher.DEFAULT_KEY_SIZE;
    }
    if (hashAlgorithm == null) {
      hashAlgorithm = RijndaelCipher.DEFAULT_HASH_ALGORITHM;
    } else {
      hashAlgorithm = hashAlgorithm.toLowerCase().replace(/-/g, '');
    }
    let array;
    if (initVector == null) {
      array = Buffer.from([]);
    } else {
      array = Buffer.from(initVector, 'ascii');
    }
    let array2;
    if (saltValue == null) {
      array2 = Buffer.from([]);
    } else {
      array2 = Buffer.from(saltValue, 'ascii');
    }
    const bytes = passwordDeriveBytes(passPhrase, array2, 1, 32, 'sha1');
    this.encryptor = crypto.createCipheriv(array.length ? 'aes-256-cbc' : 'aes-256-ecb', bytes, array);
    this.decryptor = crypto.createDecipheriv(array.length ? 'aes-256-cbc' : 'aes-256-ecb', bytes, array);
  }

  public Encrypt(plainText: string): string {
    return this.Encrypt2(Buffer.from(plainText, 'utf-8'));
  }

  public Encrypt2(plainTextBytes: Buffer): string {
    return this.EncryptToBytes2(plainTextBytes).toString('base64');
  }

  public EncryptToBytes(plainText: string): Buffer {
    return this.EncryptToBytes2(Buffer.from(plainText, 'utf-8'));
  }

  public EncryptToBytes2(plainTextBytes: Buffer): Buffer {
    const array = this.AddSalt(plainTextBytes);
    const encrypted = this.encryptor.update(array);
    const result = Buffer.concat([encrypted, this.encryptor.final()]);

    return result;
  }

  public Decrypt(cipherText: string): string {
    return this.Decrypt2(Buffer.from(cipherText, 'base64'));
  }

  public Decrypt2(cipherTextBytes: Buffer): string {
    return this.DecryptToBytes2(cipherTextBytes).toString('utf-8');
  }

  public DecryptToBytes(cipherText: string): Buffer {
    return this.DecryptToBytes2(Buffer.from(cipherText, 'base64'));
  }

  public DecryptToBytes2(cipherTextBytes: Buffer): Buffer {
    let array: any = null;
    let num = 0;
    let num2 = 0;
    array = [];

    const decryptedData = this.decryptor.update(cipherTextBytes);
    array = Buffer.concat([decryptedData, this.decryptor.final()]);

    num = array.length;

    if (this.maxSaltLen > 0 && this.maxSaltLen >= this.minSaltLen) {
      num2 = (array[0] & 3) | (array[1] & 12) | (array[2] & 48) | (array[3] & 192);
    }

    const array2 = Buffer.alloc(num - num2);
    array.copy(array2, 0, num2, num);

    return array2;
  }

  private AddSalt(plainTextBytes: Buffer): Buffer {
    if (this.maxSaltLen === 0 || this.maxSaltLen < this.minSaltLen) {
      return plainTextBytes;
    }

    const array = this.GenerateSalt();
    const array2 = Buffer.concat([array, plainTextBytes]);
    return array2;
  }

  private GenerateSalt(): Buffer {
    const num =
      this.minSaltLen === this.maxSaltLen
        ? this.minSaltLen
        : this.GenerateRandomNumber(this.minSaltLen, this.maxSaltLen);
    const array = crypto.randomBytes(num);

    array[0] = (array[0] & 252) | (num & 3);
    array[1] = (array[1] & 243) | (num & 12);
    array[2] = (array[2] & 207) | (num & 48);
    array[3] = (array[3] & 63) | (num & 192);

    return array;
  }

  private GenerateRandomNumber(minValue: number, maxValue: number): number {
    const array = crypto.randomBytes(4);
    const seed = ((array[0] & 127) << 24) | (array[1] << 16) | (array[2] << 8) | array[3];
    const random = seedrandom(String(seed));
    return Math.floor(random() * (maxValue - minValue + 1) + minValue);
  }
}
