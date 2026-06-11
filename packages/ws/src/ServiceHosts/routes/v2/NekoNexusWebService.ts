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

import NekoNexusService from '@/NekoNexusService';
import { ApiVersion } from '@/utils/enums';
import {
  ItemTransaction,
  Map,
  MapSettings,
  MemberWallet,
  PlayerInventoryItem,
  PublicProfile,
} from '@festivaldev/nekonexus-models';
import { BuyItemResult, ChannelType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  EnumProxy,
  Int32Proxy,
  ListProxy,
  NekoNexusMapViewProxy,
  StringProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import BaseWebService from '../BaseWebService';
import ApplicationWebService from './ApplicationWebService';

export default class NekoNexusWebService extends BaseWebService {
  static get ServiceName(): string {
    return 'NekoNexusWebService';
  }
  static get ServiceVersion(): string {
    return ApiVersion.Current;
  }
  // protected static get ServiceInterface(): string { return 'INekoNexusWebServiceContract'; }

  static async GetCustomMaps(data: number[], outputStream: number[]): Promise<number[] | null> {
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

        ListProxy.Serialize(outputStream, mapData, NekoNexusMapViewProxy.Serialize);
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetCustomMaps', e);
    }

    return null;
  }

  static async RecordPlayerMachineData(data: number[], outputStream: number[]): Promise<number[] | null> {
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

  static async RecordException(data: number[], outputStream: number[]): Promise<number[] | null> {
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

  static async RemoveItemFromInventory(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const itemId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('RemoveItemFromInventory', itemId, authToken);

      const session = await NekoNexusService.Instance.SessionManager.findSessionForSteamUser(authToken);
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
