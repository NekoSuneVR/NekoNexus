import RijndaelCipher from './RijndaelCipher';

export default class RijndaelCryptographyPolicy {
  public RijndaelEncrypt(inputClearText: number[], passPhrase: string, initVector: string): any {
    const rijndaelCipher = new RijndaelCipher(passPhrase, initVector);
    return [...rijndaelCipher.EncryptToBytes2(Buffer.from(inputClearText))];
  }

  public RijndaelDecrypt(inputCipherText: number[], passPhrase: string, initVector: string): any {
    const rijndaelCipher = new RijndaelCipher(passPhrase, initVector);
    return [...rijndaelCipher.DecryptToBytes2(Buffer.from(inputCipherText))];
  }
}
