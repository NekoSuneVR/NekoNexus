import { Map, MapSettings, PhotonServer, UserAccount } from '@/models';
import { ApiVersion } from '@/utils';
import { BuildType, ChannelType, PhotonUsageType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  EnumProxy,
  Int32Proxy,
  ListProxy,
  StringProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import {
  ApplicationViewProxy,
  AuthenticateApplicationViewProxy,
  BugViewProxy,
  MapViewProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization/Legacy';
import { DefinitionType, LocaleType, TutorialStepType } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { AuthenticateApplicationView } from '@festivaldev/uberstrike-js/UberStrike/DataCenter/Common/Entities';
import BaseWebService from '../BaseWebService';

export default class ApplicationWebService extends BaseWebService {
  public static get ServiceName(): string {
    return 'ApplicationWebService';
  }
  public static get ServiceVersion(): string {
    return ApiVersion.Legacy102;
  }
  // protected static get ServiceInterface(): string { return 'IApplicationWebServiceContract';

  static supportedClientVersions: List<string> = ['4.3.10'];
  static supportedClientChannels: List<ChannelType> = [ChannelType.WindowsStandalone, ChannelType.OSXStandalone];

  public static async GetPhotonServers(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const applicationView = ApplicationViewProxy.Deserialize(bytes);

      this.debugEndpoint('GetPhotonServers', applicationView);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetPhotonServers', e);
    }

    return null;
  }

  public static async GetMyIP(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      this.debugEndpoint('GetMyIP');

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetMyIP', e);
    }

    return null;
  }

  public static async AuthenticateApplication(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const bytes = data;

    try {
      const clientVersion = StringProxy.Deserialize(bytes);
      const channelType = EnumProxy.Deserialize<ChannelType>(bytes);
      const publicKey = StringProxy.Deserialize(bytes);

      this.debugEndpoint('AuthenticateApplication', clientVersion, channelType, publicKey);

      if (!ApplicationWebService.supportedClientChannels.includes(channelType)) {
        AuthenticateApplicationViewProxy.Serialize(
          outputStream,
          new AuthenticateApplicationView({
            IsEnabled: false,
          }),
        );
      } else {
        AuthenticateApplicationViewProxy.Serialize(
          outputStream,
          new AuthenticateApplicationView({
            IsEnabled: true,
            GameServers: await PhotonServer.findAll({ where: { UsageType: PhotonUsageType.All }, raw: true }),
            CommServer:
              (
                await PhotonServer.findAll({
                  where: { UsageType: PhotonUsageType.CommServer },
                  order: [['MinLatency', 'ASC']],
                  raw: true,
                })
              )[0] ?? null,
            WarnPlayer: !ApplicationWebService.supportedClientVersions.includes(clientVersion),
            EncryptionInitVector: this.EncryptionInitVector,
            EncryptionPassPhrase: this.EncryptionPassPhrase,
          }),
        );
      }

      return outputStream;
    } catch (e) {
      this.handleEndpointError('AuthenticateApplication', e);
    }

    return null;
  }

  public static async RecordException(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const buildType = EnumProxy.Deserialize<BuildType>(bytes);
      const channelType = EnumProxy.Deserialize<ChannelType>(bytes);
      const buildNumber = StringProxy.Deserialize(bytes);
      const logString = StringProxy.Deserialize(bytes);
      const stackTrace = StringProxy.Deserialize(bytes);
      const exceptionData = StringProxy.Deserialize(bytes);

      this.debugEndpoint(
        'RecordException',
        cmid,
        buildType,
        channelType,
        buildNumber,
        logString,
        stackTrace,
        exceptionData,
      );

      // throw new Error('Not Implemented');
      return outputStream;
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('RecordException', e);
    }

    return null;
  }

  public static async RecordExceptionUnencrypted(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const buildType = EnumProxy.Deserialize<BuildType>(bytes);
      const channelType = EnumProxy.Deserialize<ChannelType>(bytes);
      const buildNumber = StringProxy.Deserialize(bytes);
      const errorType = StringProxy.Deserialize(bytes);
      const errorMessage = StringProxy.Deserialize(bytes);

      this.debugEndpoint('RecordExceptionUnencrypted', buildType, channelType, buildNumber, errorType, errorMessage);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('RecordExceptionUnencrypted', e);
    }

    return null;
  }

  public static async RecordTutorialStep(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const step = EnumProxy.Deserialize<TutorialStepType>(bytes);

      this.debugEndpoint('RecordTutorialStep', cmid, step);

      const userAccount = await UserAccount.findOne({ where: { Cmid: cmid } });

      if (userAccount) {
        await userAccount.update({
          TutorialStep: step,
        });
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('RecordTutorialStep', e);
    }

    return null;
  }

  public static async ReportBug(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const bugView = BugViewProxy.Deserialize(bytes);

      this.debugEndpoint('ReportBug', bugView);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('ReportBug', e);
    }

    return null;
  }

  public static async GetLiveFeed(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      this.debugEndpoint('GetLiveFeed');

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetLiveFeed', e);
    }

    return null;
  }

  public static async GetMaps(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const appVersion = StringProxy.Deserialize(bytes);
      const locale = EnumProxy.Deserialize<LocaleType>(bytes);
      const definition = EnumProxy.Deserialize<DefinitionType>(bytes);

      this.debugEndpoint('GetMaps', appVersion, locale, definition);

      if (ApplicationWebService.supportedClientVersions.includes(appVersion)) {
        const maps = await Map.findAll().then((mapList) =>
          mapList.filter((map) => map.FileName?.['4.3.10'] !== undefined),
        );

        const mapSettings = await MapSettings.findAll({
          raw: true,
        });

        const mapData = maps.reduce((acc: any[], cur: Map) => {
          acc.push({
            ...cur.get({ plain: true }),
            SceneName: cur.SceneName['4.3.10'] || cur.SceneName.default,
            FileName: cur.FileName?.['4.3.10'],
            Settings: mapSettings
              .filter((_) => _.MapId === cur.MapId)
              .reduce((acc, cur) => {
                acc[cur.GameModeType!] = {
                  ...cur,
                  MapId: undefined,
                  GameModeType: undefined,
                };

                return acc;
              }, {}),
          });

          return acc;
        }, []);

        ListProxy.Serialize(outputStream, mapData, MapViewProxy.Serialize);
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetMaps', e);
    }

    return null;
  }

  public static async GetItemAssetBundles(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const appVersion = StringProxy.Deserialize(bytes);
      const definition = EnumProxy.Deserialize<DefinitionType>(bytes);

      this.debugEndpoint('GetItemAssetBundles', appVersion, definition);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetItemAssetBundles', e);
    }

    return null;
  }

  public static async SetLevelVersion(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const id = Int32Proxy.Deserialize(bytes);
      const version = Int32Proxy.Deserialize(bytes);
      const md5Hash = StringProxy.Deserialize(bytes);

      this.debugEndpoint('SetLevelVersion', id, version, md5Hash);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('SetLevelVersion', e);
    }

    return null;
  }

  public static async GetPhotonServerName(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const applicationVersion = StringProxy.Deserialize(bytes);
      const ipAddress = StringProxy.Deserialize(bytes);
      const port = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetPhotonServerName', applicationVersion, ipAddress, port);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetPhotonServerName', e);
    }

    return null;
  }

  public static async IsAlive(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      this.debugEndpoint('IsAlive');

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('IsAlive', e);
    }

    return null;
  }
}
