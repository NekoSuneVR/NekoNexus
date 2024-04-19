import ParadiseServiceSettings from '@/ParadiseServiceSettings';
import { Log } from '@/utils';
import RijndaelCryptographyPolicy from '@/utils/RijndaelCryptographyPolicy';

export default abstract class BaseWebService {
  public static get ServiceName(): string | null { return null; }
  public static get ServiceVersion(): string | null { return null; }
  protected static get ServiceInterface(): string | null { return null; }

  public static readonly CryptoPolicy = new RijndaelCryptographyPolicy();

  public static get EncryptionPassPhrase(): string {
    return ParadiseServiceSettings.EncryptionPassPhrase as string;
  }

  public static get EncryptionInitVector(): string {
    return ParadiseServiceSettings.EncryptionInitVector as string;
  }

  public static debugEndpoint(serviceMethod: String, ...args: any): void {
    Log.debug(`${this.ServiceName}(${this.ServiceVersion}):${serviceMethod} {\n\t${args.map((_: any) => `[${typeof _}] ${_}`).join('\n\t')}\n}`);
  }

  protected static handleEndpointError(serviceMethod: string, e: any): void {
    Log.error(`Failed to handle ${this.ServiceName}:${serviceMethod}: ${e.message}`);
    console.error(e);
  }

  public static isEncrypted(data: byte[]): bool {
    try {
      this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector);
      return true;
    } catch (error) {
      return false;
    }
  }
}
