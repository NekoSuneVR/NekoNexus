import { ItemTransaction, Map, MapSettings, MemberWallet, PlayerInventoryItem, PublicProfile } from '@/models';
import { ApiVersion } from '@/utils';
import { BuyItemResult, ChannelType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  EnumProxy,
  Int32Proxy,
  ListProxy,
  ParadiseMapViewProxy,
  StringProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import BaseWebService from '../BaseWebService';
import ApplicationWebService from './ApplicationWebService';

export default class ParadiseWebService extends BaseWebService {
  public static get ServiceName(): string {
    return 'ParadiseWebService';
  }
  public static get ServiceVersion(): string {
    return ApiVersion.Current;
  }
  // protected static get ServiceInterface(): string { return 'IParadiseWebServiceContract'; }

  public static async GetCustomMaps(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const clientVersion = StringProxy.Deserialize(bytes);
      const clientType = EnumProxy.Deserialize(bytes);

      this.debugEndpoint('GetCustomMaps', clientVersion, clientType);

      if (ApplicationWebService.supportedClientVersions.includes(clientVersion)) {
        const maps = await Map.findAll().then((mapList) =>
          mapList.filter((map) => map.FileName?.['4.7.1'] !== undefined && map.FileName?.['4.7.1'].length),
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

        ListProxy.Serialize(outputStream, mapData, ParadiseMapViewProxy.Serialize);
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetCustomMaps', e);
    }

    return null;
  }

  public static async RecordPlayerMachineData(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const clientVersion = StringProxy.Deserialize(bytes);
      const cmid = Int32Proxy.Deserialize(bytes);
      const systemIdentifier = StringProxy.Deserialize(bytes);
      const systemModel = StringProxy.Deserialize(bytes);
      const deviceType = StringProxy.Deserialize(bytes);
      const operatingSystem = StringProxy.Deserialize(bytes);
      const processorType = StringProxy.Deserialize(bytes);
      const processorCount = Int32Proxy.Deserialize(bytes);
      const systemMemorySize = Int32Proxy.Deserialize(bytes);
      const gpuVendor = StringProxy.Deserialize(bytes);
      const gpuVendorId = StringProxy.Deserialize(bytes);
      const gpuDeviceId = StringProxy.Deserialize(bytes);
      const gpuMemory = Int32Proxy.Deserialize(bytes);
      const gpuDriverVersion = StringProxy.Deserialize(bytes);

      this.debugEndpoint(
        'RecordPlayerMachineData',
        clientVersion,
        cmid,
        systemIdentifier,
        systemModel,
        deviceType,
        operatingSystem,
        processorType,
        processorCount,
        systemMemorySize,
        gpuVendor,
        gpuVendorId,
        gpuDeviceId,
        gpuMemory,
        gpuDriverVersion,
      );

      Int32Proxy.Serialize(outputStream, 0);

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('RecordPlayerMachineData', e);
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
      const channel = EnumProxy.Deserialize<ChannelType>(bytes);
      const version = StringProxy.Deserialize(bytes);
      const exceptionMessage = StringProxy.Deserialize(bytes);
      const stackTrace = StringProxy.Deserialize(bytes);
      const exceptionData = StringProxy.Deserialize(bytes);

      this.debugEndpoint('RecordException', cmid, channel, version, exceptionMessage, stackTrace, exceptionData);

      Int32Proxy.Serialize(outputStream, 0);

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('RecordException', e);
    }

    return null;
  }

  public static async RemoveItemFromInventory(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const itemId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('RemoveItemFromInventory', itemId, authToken);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (!steamMember) {
          Int32Proxy.Serialize(outputStream, BuyItemResult.InvalidMember);
        } else {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });

          if (!publicProfile) {
            Int32Proxy.Serialize(outputStream, BuyItemResult.InvalidMember);
          } else {
            const transaction = await ItemTransaction.findOne({ where: { Cmid: publicProfile.Cmid, ItemId: itemId } });
            const item = await PlayerInventoryItem.findOne({ where: { Cmid: publicProfile.Cmid, ItemId: itemId } });

            if (!transaction && !item) {
              Int32Proxy.Serialize(outputStream, BuyItemResult.InvalidData);
              // eslint-disable-next-line no-else-return
            } else if (item) {
              // Allow removing items added by the "inventory" command
              await PlayerInventoryItem.destroy({
                where: {
                  Cmid: publicProfile.Cmid,
                  ItemId: itemId,
                },
              });

              Int32Proxy.Serialize(outputStream, BuyItemResult.OK);
            } else {
              const memberWallet = await MemberWallet.findOne({ where: { Cmid: publicProfile.Cmid } });
              if (memberWallet) {
                await memberWallet.update({
                  Credits: memberWallet.Credits! + Math.round(transaction!.Credits! * 0.75),
                  Points: memberWallet.Points! + Math.round(transaction!.Points! * 0.75),
                });
              }

              await transaction!.destroy();
              await item!.destroy();

              Int32Proxy.Serialize(outputStream, BuyItemResult.OK);
            }
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('RemoveItemFromInventory', error);
    }

    return null;
  }
}
