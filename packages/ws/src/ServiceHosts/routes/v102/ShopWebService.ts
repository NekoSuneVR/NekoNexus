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

import { XpPointsUtil } from '@/utils';
import { ApiVersion } from '@/utils/enums';
import {
  ItemTransaction,
  Map,
  MemberWallet,
  PlayerInventoryItem,
  PlayerStatistics,
  PublicProfile,
  ShopBundle,
  ShopBundleItem,
  ShopFunctionalItem,
  ShopGearItem,
  ShopItemPrice,
  ShopQuickItem,
  ShopWeaponItem,
  UserAccount,
} from '@festivaldev/paradise-models';
import {
  BundleCategoryType,
  BundleView,
  BuyItemResult,
  BuyingDurationType,
  BuyingLocationType,
  BuyingRecommendationType,
  ChannelType,
  PackType,
  UberStrikeCurrencyType,
} from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  UberStrikeItemShopClientView,
  type UberStrikeItemFunctionalView,
  type UberStrikeItemGearView,
  type UberStrikeItemQuickView,
  type UberStrikeItemWeaponView,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Models/Views';
import {
  EnumProxy,
  Int32Proxy,
  ListProxy,
  StringProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import {
  BundleViewProxy,
  LuckyDrawUnityViewProxy,
  MysteryBoxUnityViewProxy,
  UberStrikeItemShopClientViewProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization/Legacy';
import { UberstrikeItemType } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import moment from 'moment';
import { Op } from 'sequelize';
import BaseWebService from '../BaseWebService';

export default class ShopWebService extends BaseWebService {
  static get ServiceName(): string {
    return 'ShopWebService';
  }
  static get ServiceVersion(): string {
    return ApiVersion.Legacy102;
  }
  // protected static get ServiceInterface(): string { return 'IShopWebServiceContract'; }

  static async GetShop(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const applicationVersion = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GetShop', applicationVersion);

      UberStrikeItemShopClientViewProxy.Serialize(
        outputStream,
        new UberStrikeItemShopClientView({
          FunctionalItems: (await ShopFunctionalItem.findAll({
            include: [{ model: ShopItemPrice, as: 'Prices', required: false }],
          })) as unknown as UberStrikeItemFunctionalView[],
          GearItems: (await ShopGearItem.findAll({
            include: [{ model: ShopItemPrice, as: 'Prices', required: false }],
          })) as unknown as UberStrikeItemGearView[],
          QuickItems: (await ShopQuickItem.findAll({
            include: [{ model: ShopItemPrice, as: 'Prices', required: false }],
          })) as unknown as UberStrikeItemQuickView[],
          WeaponItems: (await ShopWeaponItem.findAll({
            include: [{ model: ShopItemPrice, as: 'Prices', required: false }],
          })) as unknown as UberStrikeItemWeaponView[],
          ItemsRecommendationPerMap: await Map.findAll().then((maps) =>
            maps.reduce((acc: any, cur: Map) => {
              acc[cur.MapId] = cur.RecommendedItemId;
              return acc;
            }, {}),
          ),
        }),
      );

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GetShop', error);
    }

    return null;
  }

  static async BuyItem(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const itemId = Int32Proxy.Deserialize(bytes);
      const buyerCmid = Int32Proxy.Deserialize(bytes);
      const currencyType = EnumProxy.Deserialize<UberStrikeCurrencyType>(bytes);
      const durationType = EnumProxy.Deserialize<BuyingDurationType>(bytes);
      const itemType = EnumProxy.Deserialize<UberstrikeItemType>(bytes);
      const marketLocation = EnumProxy.Deserialize<BuyingLocationType>(bytes);
      const recommendationType = EnumProxy.Deserialize<BuyingRecommendationType>(bytes);

      this.debugEndpoint(
        'BuyItem',
        itemId,
        buyerCmid,
        currencyType,
        durationType,
        itemType,
        marketLocation,
        recommendationType,
      );

      const userAccount = await UserAccount.findOne({ where: { Cmid: buyerCmid } });

      if (!userAccount) {
        Int32Proxy.Serialize(outputStream, BuyItemResult.InvalidMember);
      } else {
        const publicProfile = await PublicProfile.findOne({ where: { Cmid: userAccount.Cmid } });

        if (!publicProfile) {
          Int32Proxy.Serialize(outputStream, BuyItemResult.InvalidMember);
        } else {
          const playerStatistics = await PlayerStatistics.findOne({ where: { Cmid: userAccount.Cmid } });
          const memberWallet = await MemberWallet.findOne({ where: { Cmid: publicProfile.Cmid } });

          if (!memberWallet) {
            Int32Proxy.Serialize(outputStream, BuyItemResult.InvalidMember);
          } else {
            if (
              await PlayerInventoryItem.findOne({
                where: {
                  Cmid: userAccount.Cmid,
                  ItemId: itemId,
                  ExpirationDate: {
                    [Op.or]: [
                      null,
                      {
                        [Op.gt]: new Date(),
                      },
                    ],
                  },
                },
              })
            ) {
              Int32Proxy.Serialize(outputStream, BuyItemResult.AlreadyInInventory);
            } else {
              let item: any = null;

              switch (itemType) {
                case UberstrikeItemType.Weapon:
                  item = await ShopWeaponItem.findOne({
                    where: { ID: itemId },
                    include: [
                      {
                        model: ShopItemPrice,
                        as: 'Prices',
                        required: false,
                      },
                    ],
                  });
                  break;
                case UberstrikeItemType.Gear:
                  item = await ShopGearItem.findOne({
                    where: { ID: itemId },
                    include: [
                      {
                        model: ShopItemPrice,
                        as: 'Prices',
                        required: false,
                      },
                    ],
                  });
                  break;
                case UberstrikeItemType.QuickUse:
                  item = await ShopQuickItem.findOne({
                    where: { ID: itemId },
                    include: [
                      {
                        model: ShopItemPrice,
                        as: 'Prices',
                        required: false,
                      },
                    ],
                  });
                  break;
                case UberstrikeItemType.Functional:
                  item = await ShopFunctionalItem.findOne({
                    where: { ID: itemId },
                    include: [
                      {
                        model: ShopItemPrice,
                        as: 'Prices',
                        required: false,
                      },
                    ],
                  });
                  break;
                default:
                  break;
              }

              if (!item) {
                Int32Proxy.Serialize(outputStream, BuyItemResult.ItemNotFound);
              } else {
                if (!item) {
                  Int32Proxy.Serialize(outputStream, BuyItemResult.ItemNotFound);
                } else if (!item.IsForSale) {
                  Int32Proxy.Serialize(outputStream, BuyItemResult.IsNotForSale);
                } else if (XpPointsUtil.GetLevelForXp(playerStatistics!.Xp) < item.LevelLock) {
                  Int32Proxy.Serialize(outputStream, BuyItemResult.InvalidLevel);
                } else {
                  if (currencyType === UberStrikeCurrencyType.Credits) {
                    const price = item.Prices.find((_: ShopItemPrice) => _.Currency === UberStrikeCurrencyType.Credits);

                    if (!price) {
                      Int32Proxy.Serialize(outputStream, BuyItemResult.IsNotForSale);
                    } else if (memberWallet.Credits! < price.Price) {
                      Int32Proxy.Serialize(outputStream, BuyItemResult.NotEnoughCurrency);
                    } else {
                      await memberWallet.update({
                        Credits: memberWallet.Credits! - price.Price,
                      });

                      await ItemTransaction.create({
                        Cmid: publicProfile.Cmid,
                        Duration: durationType,
                        ItemId: itemId,
                        Credits: price.Price,
                        WithdrawalDate: new Date(),
                        WithdrawalId: Math.randomInt(),
                      });
                    }
                  } else if (currencyType === UberStrikeCurrencyType.Points) {
                    const price = item.Prices.find((_: ShopItemPrice) => _.Currency === UberStrikeCurrencyType.Points);

                    if (!price) {
                      Int32Proxy.Serialize(outputStream, BuyItemResult.IsNotForSale);
                    } else if (memberWallet.Points! < price.Price) {
                      Int32Proxy.Serialize(outputStream, BuyItemResult.NotEnoughCurrency);
                    } else {
                      await memberWallet.update({
                        Credits: memberWallet.Points! - price.Price,
                      });

                      await ItemTransaction.create({
                        Cmid: publicProfile.Cmid,
                        Duration: durationType,
                        ItemId: itemId,
                        Points: price.Price,
                        WithdrawalDate: new Date(),
                        WithdrawalId: Math.randomInt(),
                      });
                    }
                  } else if (
                    currencyType === UberStrikeCurrencyType.None ||
                    UberStrikeCurrencyType[currencyType] === undefined
                  ) {
                    Int32Proxy.Serialize(outputStream, BuyItemResult.InvalidData);
                  }

                  let expirationDate;

                  switch (durationType) {
                    case BuyingDurationType.OneDay:
                      expirationDate = moment(new Date()).add(1, 'day').toDate();
                      break;
                    case BuyingDurationType.SevenDays:
                      expirationDate = moment(new Date()).add(7, 'days').toDate();
                      break;
                    case BuyingDurationType.ThirtyDays:
                      expirationDate = moment(new Date()).add(30, 'days').toDate();
                      break;
                    case BuyingDurationType.NinetyDays:
                      expirationDate = moment(new Date()).add(90, 'days').toDate();
                      break;
                    default:
                      break;
                  }

                  await PlayerInventoryItem.create({
                    Cmid: publicProfile.Cmid,
                    ItemId: itemId,
                    AmountRemaining: -1,
                    ExpirationDate: expirationDate,
                  });

                  Int32Proxy.Serialize(outputStream, BuyItemResult.OK);
                }
              }
            }
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('BuyItem', e);
    }

    return null;
  }

  static async BuyPack(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const itemId = Int32Proxy.Deserialize(bytes);
      const buyerCmid = Int32Proxy.Deserialize(bytes);
      const packType = EnumProxy.Deserialize<PackType>(bytes);
      const currencyType = EnumProxy.Deserialize<UberStrikeCurrencyType>(bytes);
      const itemType = EnumProxy.Deserialize<UberstrikeItemType>(bytes);
      const marketLocation = EnumProxy.Deserialize<BuyingLocationType>(bytes);
      const recommendationType = EnumProxy.Deserialize<BuyingRecommendationType>(bytes);

      this.debugEndpoint(
        'BuyPack',
        itemId,
        buyerCmid,
        packType,
        currencyType,
        itemType,
        marketLocation,
        recommendationType,
      );

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('BuyPack', e);
    }

    return null;
  }

  static async GetBundles(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const channel = EnumProxy.Deserialize<ChannelType>(bytes);

      this.debugEndpoint('GetBundles', channel);

      const bundles = (
        await ShopBundle.findAll({
          include: [
            {
              model: ShopBundleItem,
              as: 'BundleItemViews',
              required: false,
            },
          ],
        })
      ).filter((_) => _.Availability!.includes(channel));

      ListProxy.Serialize<BundleView>(outputStream, bundles as BundleView[], BundleViewProxy.Serialize);

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GetBundles', error);
    }

    return null;
  }

  static async BuyBundle(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const bundleId = Int32Proxy.Deserialize(bytes);
      const channel = EnumProxy.Deserialize<ChannelType>(bytes);
      const hashedReceipt = StringProxy.Deserialize(bytes);
      const applicationId = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('BuyBundle', cmid, bundleId, channel, hashedReceipt, applicationId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('BuyBundle', e);
    }

    return null;
  }

  static async UseConsumableItem(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const itemId = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('UseConsumableItem', cmid, itemId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('UseConsumableItem', e);
    }

    return null;
  }

  static async GetAllMysteryBoxs_1(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      this.debugEndpoint('GetAllMysteryBoxs_1');

      ListProxy.Serialize(outputStream, [], MysteryBoxUnityViewProxy.Serialize);

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetAllMysteryBoxs_1', e);
    }

    return null;
  }

  static async GetAllMysteryBoxs_2(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const bundleCategoryType = EnumProxy.Deserialize<BundleCategoryType>(bytes);

      this.debugEndpoint('GetAllMysteryBoxs_2', bundleCategoryType);

      ListProxy.Serialize(outputStream, [], MysteryBoxUnityViewProxy.Serialize);

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetAllMysteryBoxs_2', e);
    }

    return null;
  }

  static async GetMysteryBox(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const mysteryBoxId = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetMysteryBox', mysteryBoxId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetMysteryBox', e);
    }

    return null;
  }

  static async RollMysteryBox(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const mysteryBoxId = Int32Proxy.Deserialize(bytes);
      const channel = EnumProxy.Deserialize<ChannelType>(bytes);

      this.debugEndpoint('RollMysteryBox', cmid, mysteryBoxId, channel);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('RollMysteryBox', e);
    }

    return null;
  }

  static async GetAllLuckyDraws_1(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      this.debugEndpoint('GetAllLuckyDraws_1');

      ListProxy.Serialize(outputStream, [], LuckyDrawUnityViewProxy.Serialize);

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetAllLuckyDraws_1', e);
    }

    return null;
  }

  static async GetAllLuckyDraws_2(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const bundleCategoryType = EnumProxy.Deserialize<BundleCategoryType>(bytes);

      this.debugEndpoint('GetAllLuckyDraws_2', bundleCategoryType);

      ListProxy.Serialize(outputStream, [], LuckyDrawUnityViewProxy.Serialize);

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetAllLuckyDraws_2', e);
    }

    return null;
  }

  static async GetLuckyDraw(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const luckyDrawId = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetLuckyDraw', luckyDrawId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetLuckyDraw', e);
    }

    return null;
  }

  static async RollLuckyDraw(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const luckDrawId = Int32Proxy.Deserialize(bytes);
      const channel = EnumProxy.Deserialize<ChannelType>(bytes);

      this.debugEndpoint('RollLuckyDraw', cmid, luckDrawId, channel);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('RollLuckyDraw', e);
    }

    return null;
  }
}
