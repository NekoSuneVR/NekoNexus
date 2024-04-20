import { ApiVersion } from '@/utils';
import { Int32Proxy, StringProxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import BaseWebService from '../BaseWebService';

export default class ModerationWebService extends BaseWebService {
  public static get ServiceName(): string { return 'ModerationWebService'; }
  public static get ServiceVersion(): string { return ApiVersion.Legacy102; }
  // protected static get ServiceInterface(): string { return 'IModerationWebServiceContract'; }

  public static async BanPermanently(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

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
