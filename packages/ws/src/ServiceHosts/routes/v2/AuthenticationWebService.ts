import ParadiseService from '@/ParadiseService';
import { ProfanityFilter } from '@/ProfanityFilter';
import { Log } from '@/utils';
import { ApiVersion, ModerationFlag, UberstrikeInventoryItem } from '@/utils/enums';
import {
  Clan,
  ClanMember,
  CurrencyDeposit,
  ItemTransaction,
  MemberWallet,
  ModerationAction,
  PlayerInventoryItem,
  PlayerLoadout,
  PlayerStatistics,
  PublicProfile,
  SteamMember,
} from '@festivaldev/paradise-models';
import {
  AccountCompletionResult,
  BuyingDurationType,
  ChannelType,
  EmailAddressStatus,
  MemberAuthenticationResult,
  MemberView,
  MemberWalletView,
  PublicProfileView,
} from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  AccountCompletionResultViewProxy,
  EnumProxy,
  Int32Proxy,
  MemberAuthenticationResultViewProxy,
  StringProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import { MemberAuthenticationResultView } from '@festivaldev/uberstrike-js/UberStrike/Core/ViewModel';
import {
  AccountCompletionResultView,
  PlayerPersonalRecordStatisticsView,
  PlayerStatisticsView,
  PlayerWeaponStatisticsView,
} from '@festivaldev/uberstrike-js/UberStrike/DataCenter/Common/Entities';
import crypto from 'crypto';
import BaseWebService from '../BaseWebService';

export default class AuthenticationWebService extends BaseWebService {
  static get ServiceName(): string {
    return 'AuthenticationWebService';
  }
  static get ServiceVersion(): string {
    return ApiVersion.Current;
  }
  // protected static get ServiceInterface(): string { return 'IAuthenticationWebServiceContract'; }

  private static readonly ProfanityFilter: ProfanityFilter = new ProfanityFilter();

  static async CompleteAccount(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const name = StringProxy.Deserialize(bytes);
      const channel = EnumProxy.Deserialize<ChannelType>(bytes);
      const locale = StringProxy.Deserialize(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('CompleteAccount', cmid, name, channel, locale, machineId);

      const publicProfile = await PublicProfile.findOne({ where: { Cmid: cmid } });

      if (!publicProfile) {
        AccountCompletionResultViewProxy.Serialize(
          outputStream,
          new AccountCompletionResultView({
            Result: AccountCompletionResult.InvalidData,
          }),
        );
      } else if (publicProfile.Name.trim().length) {
        AccountCompletionResultViewProxy.Serialize(
          outputStream,
          new AccountCompletionResultView({
            Result: AccountCompletionResult.AlreadyCompletedAccount,
          }),
        );
      } else if ((await PublicProfile.findOne({ where: { Name: name } })) != null) {
        AccountCompletionResultViewProxy.Serialize(
          outputStream,
          new AccountCompletionResultView({
            Result: AccountCompletionResult.DuplicateName,
          }),
        );
      } else if (name.length < 3 || !name.match(/^[a-zA-Z0-9_]+$/)) {
        AccountCompletionResultViewProxy.Serialize(
          outputStream,
          new AccountCompletionResultView({
            Result: AccountCompletionResult.InvalidName,
          }),
        );
      } else if (this.ProfanityFilter.DetectAllProfanities(name).length > 0) {
        AccountCompletionResultViewProxy.Serialize(
          outputStream,
          new AccountCompletionResultView({
            Result: AccountCompletionResult.InvalidName,
          }),
        );
      } else {
        await publicProfile.update({
          Name: name,
        });

        await PlayerInventoryItem.bulkCreate([
          {
            Cmid: cmid,
            ItemId: UberstrikeInventoryItem.TheSplatbat,
            AmountRemaining: -1,
          },
          {
            Cmid: cmid,
            ItemId: UberstrikeInventoryItem.MachineGun,
            AmountRemaining: -1,
          },
          {
            Cmid: cmid,
            ItemId: UberstrikeInventoryItem.ShotGun,
            AmountRemaining: -1,
          },
          {
            Cmid: cmid,
            ItemId: UberstrikeInventoryItem.SniperRifle,
            AmountRemaining: -1,
          },
        ]);

        await ItemTransaction.bulkCreate([
          {
            WithdrawalId: Math.randomInt(),
            WithdrawalDate: new Date(),
            Points: 0,
            Credits: 0,
            Cmid: publicProfile.Cmid,
            ItemId: UberstrikeInventoryItem.TheSplatbat,
            Duration: BuyingDurationType.Permanent,
          },
          {
            WithdrawalId: Math.randomInt(),
            WithdrawalDate: new Date(),
            Points: 0,
            Credits: 0,
            Cmid: publicProfile.Cmid,
            ItemId: UberstrikeInventoryItem.MachineGun,
            Duration: BuyingDurationType.Permanent,
          },
          {
            WithdrawalId: Math.randomInt(),
            WithdrawalDate: new Date(),
            Points: 0,
            Credits: 0,
            Cmid: publicProfile.Cmid,
            ItemId: UberstrikeInventoryItem.SniperRifle,
            Duration: BuyingDurationType.Permanent,
          },
          {
            WithdrawalId: Math.randomInt(),
            WithdrawalDate: new Date(),
            Points: 0,
            Credits: 0,
            Cmid: publicProfile.Cmid,
            ItemId: UberstrikeInventoryItem.ShotGun,
            Duration: BuyingDurationType.Permanent,
          },
        ]);

        PlayerLoadout.update(
          {
            MeleeWeapon: UberstrikeInventoryItem.TheSplatbat,
            Weapon1: UberstrikeInventoryItem.MachineGun,
            Weapon2: UberstrikeInventoryItem.ShotGun,
            Weapon3: UberstrikeInventoryItem.SniperRifle,
          },
          {
            where: { Cmid: cmid },
          },
        );

        AccountCompletionResultViewProxy.Serialize(
          outputStream,
          new AccountCompletionResultView({
            Result: AccountCompletionResult.Ok,
            ItemsAttributed: {
              [UberstrikeInventoryItem.TheSplatbat]: 1,
              [UberstrikeInventoryItem.MachineGun]: 1,
              [UberstrikeInventoryItem.ShotGun]: 1,
              [UberstrikeInventoryItem.SniperRifle]: 1,
            },
          }),
        );

        Log.info(`${publicProfile.Name}(${publicProfile.Cmid}) logged in.`);
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('CompleteAccount', error);
    }

    return null;
  }

  static async CreateUser(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const emailAddress = StringProxy.Deserialize(bytes);
      const password = StringProxy.Deserialize(bytes);
      const channel = EnumProxy.Deserialize<ChannelType>(bytes);
      const locale = StringProxy.Deserialize(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('CreateUser', emailAddress, password, channel, locale, machineId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (error) {
      this.handleEndpointError('CreateUser', error);
    }

    return null;
  }

  static async LinkSteamMember(bytes: number[], outputStream: number[]) {
    try {
      const email = StringProxy.Deserialize(bytes);
      const password = StringProxy.Deserialize(bytes);
      const steamId = StringProxy.Deserialize(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('LinkSteamMember', email, password, steamId, machineId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (error) {
      this.handleEndpointError('LinkSteamMember', error);
    }

    return null;
  }

  static async LoginMemberEmail(bytes: number[], outputStream: number[]) {
    try {
      const email = StringProxy.Deserialize(bytes);
      const password = StringProxy.Deserialize(bytes);
      const channel = EnumProxy.Deserialize<ChannelType>(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('LoginMemberEmail', email, password, channel, machineId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (error) {
      this.handleEndpointError('LoginMemberEmail', error);
    }

    return null;
  }

  static async LoginMemberFacebookUnitySdk(bytes: number[], outputStream: number[]) {
    try {
      const facebookPlayerAccessToken = StringProxy.Deserialize(bytes);
      const channel = EnumProxy.Deserialize<ChannelType>(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('LoginMemberFacebookUnitySdk', facebookPlayerAccessToken, channel, machineId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (error) {
      this.handleEndpointError('LoginMemberFacebookUnitySdk', error);
    }

    return null;
  }

  static async LoginMemberPortal(bytes: number[], outputStream: number[]) {
    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const hash = StringProxy.Deserialize(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('LoginMemberPortal', cmid, hash, machineId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (error) {
      this.handleEndpointError('LoginMemberPortal', error);
    }

    return null;
  }

  static async LoginSteam(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const steamId = StringProxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('LoginSteam', steamId, authToken, machineId);

      let steamMember = await SteamMember.findOne({ where: { SteamId: steamId } });

      if (!steamMember) {
        const Cmid = Math.randomInt();

        const publicProfile = await PublicProfile.create({
          Cmid,
          Name: '',
          LastLoginDate: new Date(),
          EmailAddressStatus: EmailAddressStatus.Verified,
        });

        steamMember = await SteamMember.create({
          SteamId: steamId,
          Cmid,
          AuthToken: authToken,
          MachineId: machineId,
        });

        const memberWallet = await MemberWallet.create({
          Cmid,
          Points: 10000,
          Credits: 1000,
          PointsExpiration: new Date('9999-12-31T23:59:59.999Z'),
          CreditsExpiration: new Date('9999-12-31T23:59:59.999Z'),
        });

        const transactionKey = crypto.randomBytes(32).toString('hex');

        await CurrencyDeposit.create({
          CreditsDepositId: Math.randomInt(),
          DepositDate: new Date(),
          Credits: memberWallet.Credits,
          Points: memberWallet.Points,
          CurrencyLabel: '$',
          Cmid,
          TransactionKey: transactionKey,
          ApplicationId: 0,
          ChannelId: ChannelType.Steam,
          BundleName: 'Signup Reward',
        });

        const playerStatistics = await PlayerStatistics.create({
          Cmid,
          Level: 1,
          PersonalRecord: new PlayerPersonalRecordStatisticsView(),
          WeaponStatistics: new PlayerWeaponStatisticsView(),
        });

        const session = await ParadiseService.Instance.SessionManager.findOrCreateSessionForSteamUser(
          publicProfile as PublicProfileView,
          machineId,
          steamMember,
        );

        const memberAuth = new MemberAuthenticationResultView({
          MemberAuthenticationResult: MemberAuthenticationResult.Ok,
          MemberView: new MemberView({
            PublicProfile: publicProfile.get({ plain: true }) as PublicProfileView,
            MemberWallet: {
              ...(memberWallet.get({ plain: true }) as MemberWalletView),
              Credits: Math.max(memberWallet.Credits, 0),
              Points: Math.max(memberWallet.Points, 0),
            },
          }),
          PlayerStatisticsView: playerStatistics,
          ServerTime: new Date(),
          IsAccountComplete: false,
          AuthToken: session.SessionId,
        });

        MemberAuthenticationResultViewProxy.Serialize(outputStream, memberAuth);
      } else {
        const bannedMember = await ModerationAction.findOne({
          where: {
            ModerationFlag: ModerationFlag.Banned,
            TargetCmid: steamMember.Cmid,
          },
        });

        if (bannedMember && (!bannedMember.ExpireTime || bannedMember.ExpireTime > new Date())) {
          MemberAuthenticationResultViewProxy.Serialize(
            outputStream,
            new MemberAuthenticationResultView({
              MemberAuthenticationResult: MemberAuthenticationResult.IsBanned,
            }),
          );
        } else {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });

          if (!publicProfile) {
            MemberAuthenticationResultViewProxy.Serialize(
              outputStream,
              new MemberAuthenticationResultView({
                MemberAuthenticationResult: MemberAuthenticationResult.UnknownError,
              }),
            );
          } else {
            const memberWallet = await MemberWallet.findOne({ where: { Cmid: steamMember.Cmid } });
            const playerStatistics = await PlayerStatistics.findOne({ where: { Cmid: steamMember.Cmid } });

            const session = await ParadiseService.Instance.SessionManager.findOrCreateSessionForSteamUser(
              publicProfile as PublicProfileView,
              machineId,
              steamMember,
            );

            let clan;
            if (publicProfile.Name.trim().length > 0) {
              clan = await Clan.findOne({
                include: [
                  {
                    model: ClanMember,
                    as: 'Members',
                  },
                ],
              });

              if (clan) {
                const clanMember = clan.Members.find((_) => _.Cmid === steamMember!.Cmid);

                if (clanMember) {
                  ClanMember.update(
                    {
                      Lastlogin: new Date(),
                    },
                    {
                      where: {
                        GroupId: clan.GroupId,
                        Cmid: clanMember.Cmid,
                      },
                    },
                  );
                }
              }

              await publicProfile.update({
                LastLoginDate: new Date(),
              });

              Log.info(`${publicProfile.Name}(${publicProfile.Cmid}) logged in.`);
            }

            MemberAuthenticationResultViewProxy.Serialize(
              outputStream,
              new MemberAuthenticationResultView({
                MemberAuthenticationResult: MemberAuthenticationResult.Ok,
                MemberView: new MemberView({
                  PublicProfile: new PublicProfileView({
                    ...(publicProfile.get({ plain: true }) as PublicProfileView),
                  }),
                  MemberWallet: new MemberWalletView({ ...(memberWallet!.get({ plain: true }) as MemberWalletView) }),
                }),
                PlayerStatisticsView: new PlayerStatisticsView({ ...playerStatistics!.get({ plain: true }) }),
                IsAccountComplete: publicProfile.Name.trim().length > 0,
                AuthToken: session.SessionId,
              }),
            );
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('LoginSteam', error);
    }

    return null;
  }

  static async VerifyAuthToken(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('VerifyAuthToken', authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (!session) {
        MemberAuthenticationResultViewProxy.Serialize(
          outputStream,
          new MemberAuthenticationResultView({
            MemberAuthenticationResult: MemberAuthenticationResult.InvalidCookie,
          }),
        );
      } else {
        const steamMember = await session.SteamMember;

        if (!steamMember) {
          MemberAuthenticationResultViewProxy.Serialize(
            outputStream,
            new MemberAuthenticationResultView({
              MemberAuthenticationResult: MemberAuthenticationResult.UnknownError,
            }),
          );
        } else {
          const bannedMember = await ModerationAction.findOne({
            where: {
              ModerationFlag: ModerationFlag.Banned,
              TargetCmid: steamMember.Cmid,
            },
          });

          if (bannedMember && (!bannedMember.ExpireTime || bannedMember.ExpireTime > new Date())) {
            MemberAuthenticationResultViewProxy.Serialize(
              outputStream,
              new MemberAuthenticationResultView({
                MemberAuthenticationResult: MemberAuthenticationResult.IsBanned,
              }),
            );
          } else {
            const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });

            if (!publicProfile) {
              MemberAuthenticationResultViewProxy.Serialize(
                outputStream,
                new MemberAuthenticationResultView({
                  MemberAuthenticationResult: MemberAuthenticationResult.UnknownError,
                }),
              );
            } else {
              const memberWallet = await MemberWallet.findOne({ where: { Cmid: steamMember.Cmid } });
              const playerStatistics = await MemberWallet.findOne({ where: { Cmid: steamMember.Cmid } });

              MemberAuthenticationResultViewProxy.Serialize(
                outputStream,
                new MemberAuthenticationResultView({
                  MemberAuthenticationResult: MemberAuthenticationResult.Ok,
                  MemberView: new MemberView({
                    PublicProfile: new PublicProfileView({
                      ...(publicProfile.get({ plain: true }) as PublicProfileView),
                    }),
                    MemberWallet: new MemberWalletView({ ...(memberWallet!.get({ plain: true }) as MemberWalletView) }),
                  }),
                  PlayerStatisticsView: new PlayerStatisticsView({ ...playerStatistics!.get({ plain: true }) }),
                  ServerTime: new Date(),
                  IsAccountComplete: publicProfile.Name.trim().length > 0,
                  AuthToken: session.SessionId,
                }),
              );

              if (publicProfile.Name.trim().length > 0) {
                const clan = await Clan.findOne({
                  include: [
                    {
                      model: ClanMember,
                      as: 'Members',
                    },
                  ],
                });

                if (clan) {
                  const clanMember = clan.Members.find((_) => _.Cmid === steamMember.Cmid);
                  clanMember?.update({
                    GroupId: clan.GroupId,
                    Lastlogin: new Date(),
                  });
                }
              }
            }
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('VerifyAuthToken', error);
    }

    return null;
  }
}
