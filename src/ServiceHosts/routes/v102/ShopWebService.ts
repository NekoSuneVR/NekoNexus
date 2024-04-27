import {
  Map,
  ShopBundle,
  ShopBundleItem,
  ShopFunctionalItem,
  ShopGearItem,
  ShopItemPrice,
  ShopQuickItem,
  ShopWeaponItem,
} from '@/models';
import { ApiVersion } from '@/utils';
import {
  BundleCategoryType,
  BundleView,
  BuyingDurationType,
  BuyingLocationType,
  BuyingRecommendationType,
  ChannelType,
  PackType,
  UberStrikeCurrencyType,
} from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { UberStrikeItemShopClientView } from '@festivaldev/uberstrike-js/UberStrike/Core/Models/Views';
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
import BaseWebService from '../BaseWebService';

export default class ShopWebService extends BaseWebService {
  public static get ServiceName(): string {
    return 'ShopWebService';
  }
  public static get ServiceVersion(): string {
    return ApiVersion.Legacy102;
  }
  // protected static get ServiceInterface(): string { return 'IShopWebServiceContract'; }

  public static async GetShop(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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
          FunctionalItems: await ShopFunctionalItem.findAll({
            include: [{ model: ShopItemPrice, as: 'Prices', required: false }],
          }),
          GearItems: await ShopGearItem.findAll({ include: [{ model: ShopItemPrice, as: 'Prices', required: false }] }),
          QuickItems: await ShopQuickItem.findAll({
            include: [{ model: ShopItemPrice, as: 'Prices', required: false }],
          }),
          WeaponItems: await ShopWeaponItem.findAll({
            include: [{ model: ShopItemPrice, as: 'Prices', required: false }],
          }),
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

  public static async BuyItem(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('BuyItem', e);
    }

    return null;
  }

  public static async BuyPack(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

  public static async GetBundles(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

  public static async BuyBundle(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

  public static async UseConsumableItem(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

  public static async GetAllMysteryBoxs_1(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

  public static async GetAllMysteryBoxs_2(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

  public static async GetMysteryBox(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

  public static async RollMysteryBox(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

  public static async GetAllLuckyDraws_1(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

  public static async GetAllLuckyDraws_2(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

  public static async GetLuckyDraw(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

  public static async RollLuckyDraw(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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
