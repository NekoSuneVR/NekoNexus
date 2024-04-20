import { MemberWallet, PlayerInventoryItem, PlayerLoadout, PlayerStatistics, PublicProfile, UserAccount } from '@/models';
import { ApiVersion, LoadoutFilter, UberstrikeInventoryItem } from '@/utils';
import { ItemInventoryView, MemberOperationResult, MemberView } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { BooleanProxy, EnumProxy, Int32Proxy, ListProxy, StringProxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import { ItemInventoryViewProxy, LoadoutViewProxy, PlayerLevelCapViewProxy, UberstrikeUserViewModelProxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization/Legacy';
import { UberstrikeUserViewModel } from '@festivaldev/uberstrike-js/UberStrike/Core/ViewModel';
import { LoadoutView, PlayerLevelCapView, UberstrikeMemberView } from '@festivaldev/uberstrike-js/UberStrike/DataCenter/Common/Entities';
import { Op } from 'sequelize';
import BaseWebService from '../BaseWebService';

export default class UserWebService extends BaseWebService {
  public static get ServiceName(): string { return 'UserWebService'; }
  public static get ServiceVersion(): string { return ApiVersion.Legacy102; }
  // protected static get ServiceInterface(): string { return 'IUserWebServiceContract'; }

  public static async ChangeMemberName(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const name = StringProxy.Deserialize(bytes);
      const locale = StringProxy.Deserialize(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('ChangeMemberName', cmid, name, locale, machineId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('ChangeMemberName', e);
    }

    return null;
  }

  public static async IsDuplicateMemberName(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const username = StringProxy.Deserialize(bytes);

      this.debugEndpoint('IsDuplicateMemberName', username);

      BooleanProxy.Serialize(outputStream, !!(await PublicProfile.findOne({ where: { Name: username } })));

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('IsDuplicateMemberName', e);
    }

    return null;
  }

  public static async GenerateNonDuplicatedMemberNames(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const username = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GenerateNonDuplicatedMemberNames', username);

      const generatedUsernames: any[] = [];

      while (generatedUsernames.length < 3) {
        const number = Math.randomInt(1, 99999);

        const generatedUsername = `${username.substring(0, Math.min(username.length, 18 - String(number).length))}${number}`;

        if (!(await PublicProfile.findOne({ where: { Name: generatedUsername } }))) {
          generatedUsernames.push(generatedUsername);
        }
      }

      ListProxy.Serialize<string>(outputStream, generatedUsernames, StringProxy.Serialize);

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GenerateNonDuplicatedMemberNames', error);
    }

    return null;
  }

  public static async GetMemberWallet(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetMemberWallet', cmid);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetMemberWallet', e);
    }

    return null;
  }

  public static async GetInventory(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetInventory', cmid);

      const userAccount = await UserAccount.findOne({ where: { Cmid: cmid } });

      if (userAccount) {
        const playerInventoryItems = await PlayerInventoryItem.findAll({
          where: {
            Cmid: userAccount.Cmid,
            [Op.or]: [{ ExpirationDate: null }, { ExpirationDate: { [Op.gte]: new Date() } }],
          },
          raw: true,
        });

        ListProxy.Serialize<ItemInventoryView>(outputStream, playerInventoryItems as ItemInventoryView[], ItemInventoryViewProxy.Serialize);
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GetInventory', error);
    }

    return null;
  }

  public static async GetCurrencyDeposits(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const pageIndex = Int32Proxy.Deserialize(bytes);
      const elementPerPage = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetCurrencyDeposits', cmid, pageIndex, elementPerPage);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetCurrencyDeposits', e);
    }

    return null;
  }

  public static async GetItemTransactions(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const pageIndex = Int32Proxy.Deserialize(bytes);
      const elementPerPage = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetItemTransactions', cmid, pageIndex, elementPerPage);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetItemTransactions', e);
    }

    return null;
  }

  public static async GetPointsDeposits(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const pageIndex = Int32Proxy.Deserialize(bytes);
      const elementPerPage = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetPointsDeposits', cmid, pageIndex, elementPerPage);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetPointsDeposits', e);
    }

    return null;
  }

  public static async SetScore(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('SetScore', cmid);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('SetScore', e);
    }

    return null;
  }

  public static async GetMember(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetMember', cmid);

        const userAccount = await UserAccount.findOne({ where: { Cmid: cmid } });
        console.log(userAccount);

        if (userAccount) {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: userAccount.Cmid } });
          const memberWallet = await MemberWallet.findOne({ where: { Cmid: userAccount.Cmid } });
          const memberItems = (await PlayerInventoryItem.findAll({ where: { Cmid: userAccount.Cmid } })).map((_) => _.ItemId);
          const playerStatistics = await PlayerStatistics.findOne({ where: { Cmid: userAccount.Cmid } });

          console.log(publicProfile, memberWallet, memberItems, playerStatistics);

          if (publicProfile && memberWallet && memberItems && playerStatistics) {
            UberstrikeUserViewModelProxy.Serialize(outputStream, new UberstrikeUserViewModel({
              CmuneMemberView: new MemberView({
                PublicProfile: publicProfile.get({ plain: true }),
                MemberWallet: memberWallet.get({ plain: true }),
                MemberItems: memberItems,
              }),
              UberstrikeMemberView: new UberstrikeMemberView({
                PlayerStatisticsView: playerStatistics.get({ plain: true }),
              }),
            }));
          }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GetMember', error);
    }

    return null;
  }

  public static async GetLoadout(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetLoadout', cmid);

        const userAccount = await UserAccount.findOne({ where: { Cmid: cmid } });

        if (userAccount) {
          let playerLoadout = await PlayerLoadout.findOne({ where: { Cmid: userAccount.Cmid } });

          if (!playerLoadout) {
            playerLoadout = await PlayerLoadout.create({
              Cmid: userAccount.Cmid,
              Boots: UberstrikeInventoryItem.LutzDefaultGearBoots,
              Gloves: UberstrikeInventoryItem.LutzDefaultGearGloves,
              Head: UberstrikeInventoryItem.LutzDefaultGearHead,
              LowerBody: UberstrikeInventoryItem.LutzDefaultGearLowerBody,
              UpperBody: UberstrikeInventoryItem.LutzDefaultGearUpperBody,
              MeleeWeapon: UberstrikeInventoryItem.TheSplatbat,
              Weapon1: UberstrikeInventoryItem.MachineGun,
              Weapon2: UberstrikeInventoryItem.ShotGun,
              Weapon3: UberstrikeInventoryItem.SniperRifle,
            });
          }

          const playerInventory = await PlayerInventoryItem.findAll({ where: { Cmid: userAccount.Cmid } });
          playerLoadout = LoadoutFilter.Filter<PlayerLoadout>(playerLoadout, playerInventory);

          LoadoutViewProxy.Serialize(outputStream, new LoadoutView({ ...playerLoadout.get({ plain: true }) }));
        }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GetLoadout', error);
    }

    return null;
  }

  public static async SetLoadout(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      let loadoutView = LoadoutViewProxy.Deserialize(bytes);

      this.debugEndpoint('SetLoadout', loadoutView);

        const userAccount = await UserAccount.findOne({ where: { Cmid: loadoutView!.Cmid } });

        if (!userAccount) {
          EnumProxy.Serialize<MemberOperationResult>(outputStream, MemberOperationResult.MemberNotFound);
        } else {
          const playerInventory = await PlayerInventoryItem.findAll({ where: { Cmid: userAccount.Cmid } });

          loadoutView = LoadoutFilter.Filter(loadoutView!, playerInventory);

          const playerLoadout = await PlayerLoadout.findOne({ where: { Cmid: userAccount.Cmid } });
          if (!playerLoadout) {
            EnumProxy.Serialize<MemberOperationResult>(outputStream, MemberOperationResult.InvalidData);
          } else {
            await playerLoadout.update({
              UpperBody: loadoutView.UpperBody,
              Weapon1: loadoutView.Weapon1,
              Weapon2: loadoutView.Weapon2,
              Weapon3: loadoutView.Weapon3,
              Type: loadoutView.Type,
              QuickItem3: loadoutView.QuickItem3,
              QuickItem2: loadoutView.QuickItem2,
              QuickItem1: loadoutView.QuickItem1,
              MeleeWeapon: loadoutView.MeleeWeapon,
              LowerBody: loadoutView.LowerBody,
              Head: loadoutView.Head,
              Gloves: loadoutView.Gloves,
              FunctionalItem3: loadoutView.FunctionalItem3,
              FunctionalItem2: loadoutView.FunctionalItem2,
              FunctionalItem1: loadoutView.FunctionalItem1,
              Face: loadoutView.Face,
              Cmid: loadoutView.Cmid,
              Boots: loadoutView.Boots,
              Backpack: loadoutView.Backpack,
              LoadoutId: loadoutView.LoadoutId,
              Webbing: loadoutView.Webbing, // Holo
              SkinColor: loadoutView.SkinColor,
            });

            EnumProxy.Serialize<MemberOperationResult>(outputStream, MemberOperationResult.Ok);
          }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('SetLoadout', error);
    }

    return null;
  }

  public static async GetXPEventsView(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      this.debugEndpoint('GetXPEventsView');

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetXPEventsView', e);
    }

    return null;
  }

  public static async GetLevelCapsView(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      this.debugEndpoint('GetLevelCapsView');

      ListProxy.Serialize<PlayerLevelCapView>(outputStream, [
        new PlayerLevelCapView({ "Level": 1, "XPRequired": 0 }),
        new PlayerLevelCapView({ "Level": 2, "XPRequired": 800 }),
        new PlayerLevelCapView({ "Level": 3, "XPRequired": 2100 }),
        new PlayerLevelCapView({ "Level": 4, "XPRequired": 3800 }),
        new PlayerLevelCapView({ "Level": 5, "XPRequired": 6100 }),
        new PlayerLevelCapView({ "Level": 6, "XPRequired": 9500 }),
        new PlayerLevelCapView({ "Level": 7, "XPRequired": 12500 }),
        new PlayerLevelCapView({ "Level": 8, "XPRequired": 16000 }),
        new PlayerLevelCapView({ "Level": 9, "XPRequired": 19800 }),
        new PlayerLevelCapView({ "Level": 10, "XPRequired": 24000 }),
      ], PlayerLevelCapViewProxy.Serialize);

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetLevelCapsView', e);
    }

    return null;
  }
}
