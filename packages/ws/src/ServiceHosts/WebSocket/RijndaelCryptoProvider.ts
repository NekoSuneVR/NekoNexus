import crypto from 'crypto';

export default class RijndaelCryptoProvider {
  private key: Buffer;
  private iv: Buffer;

  constructor(key: Buffer, salt: Buffer, iv: Buffer) {
    this.key = crypto.pbkdf2Sync(key, salt, 1000, 32, 'sha1');
    this.iv = iv;
  }

  public encrypt(clearText: Buffer) {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
    return Buffer.concat([cipher.update(clearText), cipher.final()]);
  }

  public decrypt(cipherText: Buffer) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
    return Buffer.concat([decipher.update(cipherText), decipher.final()]);
  }
}
