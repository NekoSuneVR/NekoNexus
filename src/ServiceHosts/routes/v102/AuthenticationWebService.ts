import ParadiseService from '@/ParadiseService';
import { ProfanityFilter } from '@/ProfanityFilter';
import {
  Clan,
  ClanMember,
  ItemTransaction,
  MemberWallet,
  ModerationAction,
  PlayerInventoryItem,
  PlayerLoadout,
  PlayerStatistics,
  PublicProfile,
  UserAccount,
} from '@/models';
import { ApiVersion, Log, ModerationFlag, UberstrikeInventoryItem } from '@/utils';
import {
  AccountCompletionResult,
  BuyingDurationType,
  ChannelType,
  EmailAddressStatus,
  MemberAuthenticationResult,
  MemberRegistrationResult,
  MemberView,
  MemberWalletView,
  PublicProfileView,
  WeeklySpecialView,
} from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  DateTimeProxy,
  EnumProxy,
  Int32Proxy,
  StringProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import {
  AccountCompletionResultViewProxy,
  MemberAuthenticationResultViewProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization/Legacy';
import { TutorialStepType } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { MemberAuthenticationResultView } from '@festivaldev/uberstrike-js/UberStrike/Core/ViewModel';
import {
  AccountCompletionResultView,
  PlayerPersonalRecordStatisticsView,
  PlayerStatisticsView,
  PlayerWeaponStatisticsView,
} from '@festivaldev/uberstrike-js/UberStrike/DataCenter/Common/Entities';
import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';
import BaseWebService from '../BaseWebService';

export default class AuthenticationWebService extends BaseWebService {
  public static get ServiceName(): string {
    return 'AuthenticationWebService';
  }
  public static get ServiceVersion(): string {
    return ApiVersion.Legacy102;
  }
  // protected static get ServiceInterface(): string { return 'IAuthenticationWebServiceContract'; }

  private static readonly ProfanityFilter: ProfanityFilter = new ProfanityFilter();

  private static weeklySpecial: WeeklySpecialView = new WeeklySpecialView({
    StartDate: new Date('1970-01-01T01:00:00.000Z'),
    EndDate: new Date('9999-12-31T23:59:59.999Z'),
    Id: 0,
    ImageUrl: 'http://via.placeholder.com/350x150',
    Text: 'LockWatch 2 Beta (iOS 13/14)',
    Title: 'Team FESTIVAL',
    ItemId: 1003,
  });

  public static async CreateUser(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

      if (await UserAccount.findOne({ where: { EmailAddress: emailAddress } })) {
        EnumProxy.Serialize<MemberRegistrationResult>(outputStream, MemberRegistrationResult.DuplicateEmail);
      } else {
        const Cmid = Math.randomInt();

        const userAccount = await UserAccount.create({
          Cmid,
          EmailAddress: emailAddress,
          Password: bcrypt.hashSync(password, 10),
          Channel: channel,
          Locale: locale,
        });

        if (userAccount) {
          EnumProxy.Serialize<MemberRegistrationResult>(outputStream, MemberRegistrationResult.Ok);
        } else {
          EnumProxy.Serialize<MemberRegistrationResult>(outputStream, MemberRegistrationResult.Error_MemberNotCreated);
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('CreateUser', e);
    }

    return null;
  }

  public static async CompleteAccount(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
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

      const userAccount = await UserAccount.findOne({ where: { Cmid: cmid } });

      if (userAccount) {
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

          MemberWallet.update({ Points: Sequelize.literal('Points + 2000') }, { where: { Cmid: cmid } });

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
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('CompleteAccount', e);
    }

    return null;
  }

  public static async LoginMemberEmail(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const email = StringProxy.Deserialize(bytes);
      const password = StringProxy.Deserialize(bytes);
      const channelType = EnumProxy.Deserialize<ChannelType>(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('LoginMemberEmail', email, password, channelType, machineId);

      const userAccount = await UserAccount.findOne({ where: { EmailAddress: email } });

      if (!userAccount) {
        MemberAuthenticationResultViewProxy.Serialize(
          outputStream,
          new MemberAuthenticationResultView({
            MemberAuthenticationResult: MemberAuthenticationResult.InvalidEmail,
          }),
        );
      } else {
        if (!bcrypt.compareSync(password, userAccount.Password)) {
          MemberAuthenticationResultViewProxy.Serialize(
            outputStream,
            new MemberAuthenticationResultView({
              MemberAuthenticationResult: MemberAuthenticationResult.InvalidPassword,
            }),
          );
        } else {
          const bannedMember = await ModerationAction.findOne({
            where: {
              ModerationFlag: ModerationFlag.Banned,
              TargetCmid: userAccount.Cmid,
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
            const publicProfile = await PublicProfile.findOne({ where: { Cmid: userAccount.Cmid } });

            if (!publicProfile) {
              const publicProfile = await PublicProfile.create({
                Cmid: userAccount.Cmid,
                Name: '',
                LastLoginDate: new Date(),
                EmailAddressStatus: EmailAddressStatus.Verified,
              });

              const memberWallet = await MemberWallet.create({
                Cmid: publicProfile.Cmid,
                // Points: 10000,
                // Credits: 1000,
                PointsExpiration: new Date('9999-12-31T23:59:59.999Z'),
                CreditsExpiration: new Date('9999-12-31T23:59:59.999Z'),
              });

              // const transactionKey = crypto.randomBytes(32).toString('hex');

              // await CurrencyDeposit.create({
              //   CreditsDepositId: Math.randomInt(),
              //   BundleName: 'Signup Reward',
              //   Cmid,
              //   Credits: memberWallet.Credits,
              //   CurrencyLabel: '$',
              //   DepositDate: new Date(),
              //   Points: memberWallet.Points,
              //   TransactionKey: transactionKey,
              // });

              const playerStatistics = await PlayerStatistics.create({
                Cmid: publicProfile.Cmid,
                Level: 1,
                PersonalRecord: new PlayerPersonalRecordStatisticsView(),
                WeaponStatistics: new PlayerWeaponStatisticsView(),
              });

              const session = await ParadiseService.Instance.SessionManager.findOrCreateSession(
                publicProfile as PublicProfileView,
                machineId,
                userAccount,
              );

              const memberAuth = new MemberAuthenticationResultView({
                MemberAuthenticationResult: MemberAuthenticationResult.Ok,
                MemberView: new MemberView({
                  PublicProfile: publicProfile.get({ plain: true }),
                  MemberWallet: {
                    ...memberWallet.get({ plain: true }),
                    Credits: Math.max(memberWallet.Credits, 0),
                    Points: Math.max(memberWallet.Points, 0),
                  },
                }),
                PlayerStatisticsView: playerStatistics,
                ServerTime: new Date(),
                IsAccountComplete: false,
                IsTutorialComplete: false,
                AuthToken: session.SessionId,
                WeeklySpecial: this.weeklySpecial,
              });

              MemberAuthenticationResultViewProxy.Serialize(outputStream, memberAuth);
            } else {
              const memberWallet = await MemberWallet.findOne({ where: { Cmid: userAccount.Cmid } });
              const playerStatistics = await PlayerStatistics.findOne({ where: { Cmid: userAccount.Cmid } });

              const session = await ParadiseService.Instance.SessionManager.findOrCreateSession(
                publicProfile as PublicProfileView,
                machineId,
                userAccount,
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
                  const clanMember = clan.Members.find((_) => _.Cmid === userAccount!.Cmid);

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
                    PublicProfile: new PublicProfileView({ ...publicProfile.get({ plain: true }) }),
                    MemberWallet: new MemberWalletView({ ...memberWallet!.get({ plain: true }) }),
                  }),
                  PlayerStatisticsView: new PlayerStatisticsView({ ...playerStatistics!.get({ plain: true }) }),
                  IsAccountComplete: publicProfile.Name.trim().length > 0,
                  IsTutorialComplete: userAccount.TutorialStep >= TutorialStepType.TutorialComplete,
                  AuthToken: session.SessionId,
                  WeeklySpecial: this.weeklySpecial,
                }),
              );
            }
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('LoginMemberEmail', error);
    }

    return null;
  }

  public static async LoginMemberCookie(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const expirationTime = DateTimeProxy.Deserialize(bytes);
      const encryptedContent = StringProxy.Deserialize(bytes);
      const hash = StringProxy.Deserialize(bytes);
      const channelType = EnumProxy.Deserialize<ChannelType>(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('LoginMemberCookie', cmid, expirationTime, encryptedContent, hash, channelType, machineId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('LoginMemberCookie', e);
    }

    return null;
  }

  public static async LoginMemberFacebook(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const facebookId = StringProxy.Deserialize(bytes);
      const hash = StringProxy.Deserialize(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('LoginMemberFacebook', facebookId, hash, machineId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('LoginMemberFacebook', e);
    }

    return null;
  }

  public static async FacebookSingleSignOn(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);
      const channelType = EnumProxy.Deserialize<ChannelType>(bytes);
      const machineId = StringProxy.Deserialize(bytes);

      this.debugEndpoint('FacebookSingleSignOn', authToken, channelType, machineId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('FacebookSingleSignOn', e);
    }

    return null;
  }
}
