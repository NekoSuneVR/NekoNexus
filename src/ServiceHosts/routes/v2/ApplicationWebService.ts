import { ApplicationConfiguration, Map, MapSettings, PhotonServer } from '@/models';
import { ApiVersion } from '@/utils';
import { ChannelType, PhotonUsageType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { ApplicationConfigurationView } from '@festivaldev/uberstrike-js/UberStrike/Core/Models/Views';
import {
  ApplicationConfigurationViewProxy,
  AuthenticateApplicationViewProxy,
  EnumProxy,
  ListProxy,
  MapViewProxy,
  MatchStatsProxy,
  StringProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import { AuthenticateApplicationView } from '@festivaldev/uberstrike-js/UberStrike/DataCenter/Common/Entities';
import BaseWebService from '../BaseWebService';

export default class ApplicationWebService extends BaseWebService {
  public static get ServiceName(): string {
    return 'ApplicationWebService';
  }
  public static get ServiceVersion(): string {
    return ApiVersion.Current;
  }
  // protected static get ServiceInterface(): string { return 'IApplicationWebServiceContract'; }

  static supportedClientVersions: List<string> = ['4.7.1'];
  static supportedClientChannels: List<ChannelType> = [ChannelType.Steam];

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

  public static async GetConfigurationData(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const clientVersion = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GetConfigurationData', clientVersion);

      if (ApplicationWebService.supportedClientVersions.includes(clientVersion)) {
        const applicationConfiguration = await ApplicationConfiguration.findOne();

        ApplicationConfigurationViewProxy.Serialize(
          outputStream,
          new ApplicationConfigurationView({ ...applicationConfiguration!.get({ plain: true }) }),
        );
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('AutGetConfigurationDatahenticateApplication', e);
    }

    return null;
  }

  public static async GetMaps(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const clientVersion = StringProxy.Deserialize(bytes);
      const clientType = EnumProxy.Deserialize(bytes);

      this.debugEndpoint('GetMaps', clientVersion, clientType);

      if (ApplicationWebService.supportedClientVersions.includes(clientVersion)) {
        const maps = await Map.findAll().then((mapList) =>
          mapList.filter((map) => map.FileName?.['4.7.1'] !== undefined && !map.FileName?.['4.7.1'].length),
        );

        const mapSettings = await MapSettings.findAll({
          raw: true,
        });

        const mapData = maps.reduce((acc: any[], cur: Map) => {
          acc.push({
            ...cur.get({ plain: true }),
            SceneName: cur.SceneName['4.7.1'] || cur.SceneName.default,
            FileName: cur.FileName?.['4.7.1'],
            Settings: mapSettings
              .filter((_) => _.MapId === cur.MapId)
              .reduce((acc: { [key: number]: any }, cur) => {
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

  public static async SetMatchScore(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const clientVersion = StringProxy.Deserialize(bytes);
      const scoringView = MatchStatsProxy.Deserialize(bytes);
      const serverAuthentication = StringProxy.Deserialize(bytes);

      this.debugEndpoint('SetMatchScore', clientVersion, scoringView, serverAuthentication);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('SetMatchScore', e);
    }

    return null;
  }
}
