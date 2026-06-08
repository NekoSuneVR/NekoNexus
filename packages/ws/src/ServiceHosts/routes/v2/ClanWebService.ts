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

import ParadiseService from '@/ParadiseService';
import { ProfanityFilter } from '@/ProfanityFilter';
import { XpPointsUtil } from '@/utils';
import { ApiVersion, UberstrikeInventoryItem } from '@/utils/enums';
import {
  Clan,
  ClanMember,
  ContactRequest,
  GroupInvitation,
  PlayerInventoryItem,
  PlayerStatistics,
  PublicProfile,
} from '@festivaldev/paradise-models';
import {
  ClanCreationReturnView,
  ClanRequestAcceptView,
  ClanRequestDeclineView,
  ClanView,
  ContactRequestStatus,
  GroupInvitationView,
  GroupPosition,
  GroupType,
  MemberAccessLevel,
  type ClanMemberView,
} from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  ClanCreationReturnViewProxy,
  ClanRequestAcceptViewProxy,
  ClanRequestDeclineViewProxy,
  ClanViewProxy,
  GroupCreationViewProxy,
  GroupInvitationViewProxy,
  Int32Proxy,
  ListProxy,
  MemberPositionUpdateViewProxy,
  StringProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import { Op } from 'sequelize';
import BaseWebService from '../BaseWebService';

enum ClanCreationResultCode {
  Success,
  InvalidClanName,
  ClanCollision,
  ClanNameTaken,
  InvalidClanTag,
  InvalidClanMotto = 8,
  ClanTagTaken = 10,
  RequirementPlayerLevel = 100,
  RequirementPlayerFriends,
  RequirementClanLicense,
}

enum ClanActionResultCode {
  Success,
  Error,
}

export default class ClanWebService extends BaseWebService {
  static get ServiceName(): string {
    return 'ClanWebService';
  }
  static get ServiceVersion(): string {
    return ApiVersion.Current;
  }
  // protected static get ServiceInterface(): string { return 'IClanWebServiceContract'; }

  private static readonly ProfanityFilter: ProfanityFilter = new ProfanityFilter();

  static async AcceptClanInvitation(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const clanInvitationId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('AcceptClanInvitation', clanInvitationId, authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });

          if (publicProfile) {
            const groupInvitation = await GroupInvitation.findOne({ where: { GroupInvitationId: clanInvitationId } });

            if (groupInvitation) {
              const clan = await Clan.findOne({ where: { GroupId: groupInvitation.GroupId } });

              if (clan) {
                await ClanMember.create({
                  // GroupId was missing -> the new member had no clan link, so accepting an
                  // invite did nothing usable (no membership, no tag). Link it to the clan.
                  GroupId: clan.GroupId,
                  Cmid: publicProfile.Cmid,
                  Name: publicProfile.Name,
                  Position: GroupPosition.Member,
                  JoiningDate: new Date(),
                  Lastlogin: publicProfile.LastLoginDate,
                });

                // Stamp the clan tag on the profile so [TAG] shows in chat (applied next login).
                await publicProfile.update({ GroupTag: clan.Tag });

                groupInvitation.destroy();

                ClanRequestAcceptViewProxy.Serialize(
                  outputStream,
                  new ClanRequestAcceptView({
                    ActionResult: ClanActionResultCode.Success,
                    ClanRequestId: clanInvitationId,
                    ClanView: clan.get({ plain: true }) as ClanView,
                  }),
                );

                return isEncrypted
                  ? this.CryptoPolicy.RijndaelEncrypt(
                      outputStream,
                      this.EncryptionPassPhrase,
                      this.EncryptionInitVector,
                    )
                  : outputStream;
              }
            }
          }
        }

        ClanRequestAcceptViewProxy.Serialize(
          outputStream,
          new ClanRequestAcceptView({
            ActionResult: ClanActionResultCode.Error,
            ClanRequestId: clanInvitationId,
          }),
        );
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('AcceptClanInvitation', error);
    }

    return null;
  }

  static async CancelInvitation(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const groupInvitationId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('CancelInvitation', groupInvitationId, authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const groupInvitation = await GroupInvitation.findOne({ where: { GroupInvitationId: groupInvitationId } });

          if (groupInvitation) {
            groupInvitation.destroy();

            Int32Proxy.Serialize(outputStream, ClanActionResultCode.Success);
          } else {
            Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('CancelInvitation', error);
    }

    return null;
  }

  static async CanOwnClan(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('CanOwnClan', authToken);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (error) {
      this.handleEndpointError('CanOwnClan', error);
    }

    return null;
  }

  static async CreateClan(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const createClanData = GroupCreationViewProxy.Deserialize(bytes);

      this.debugEndpoint('CreateClan', createClanData);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(createClanData.AuthToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });

          if (publicProfile) {
            if (await ClanMember.findOne({ where: { Cmid: steamMember.Cmid } })) {
              // "Clan Collision", "You are already member of another clan, please leave first before creating your own."

              ClanCreationReturnViewProxy.Serialize(
                outputStream,
                new ClanCreationReturnView({
                  ResultCode: ClanCreationResultCode.ClanCollision,
                }),
              );

              return isEncrypted
                ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
                : outputStream;
            }

            const friendsList = await ContactRequest.findAll({
              where: {
                [Op.or]: {
                  InitiatorCmid: publicProfile.Cmid,
                  ReceiverCmid: publicProfile.Cmid,
                },
                Status: ContactRequestStatus.Accepted,
              },
            });
            const playerStatistics = await PlayerStatistics.findOne({ where: { Cmid: steamMember.Cmid } });
            const hasClanLicense =
              (await PlayerInventoryItem.findOne({
                where: { Cmid: steamMember.Cmid, ItemId: UberstrikeInventoryItem.ClanLicense },
              })) != null;

            if (
              createClanData.Name.length < 3 ||
              !createClanData.Name.match(/^[a-zA-Z0-9_]+$/) ||
              this.ProfanityFilter.DetectAllProfanities(createClanData.Name).length > 0
            ) {
              // "Invalid Clan Name", "The name '" + name + "' is not valid, please modify it."

              ClanCreationReturnViewProxy.Serialize(
                outputStream,
                new ClanCreationReturnView({
                  ResultCode: ClanCreationResultCode.InvalidClanName,
                }),
              );
            } else if (await Clan.findOne({ where: { Name: createClanData.Name } })) {
              // "Clan Name", "The name '" + name + "' is already taken, try another one."

              ClanCreationReturnViewProxy.Serialize(
                outputStream,
                new ClanCreationReturnView({
                  ResultCode: ClanCreationResultCode.ClanNameTaken,
                }),
              );
            } else if (this.ProfanityFilter.DetectAllProfanities(createClanData.Tag).length > 0) {
              // "Invalid Clan Tag", "The tag '" + tag + "' is not valid, please modify it."

              ClanCreationReturnViewProxy.Serialize(
                outputStream,
                new ClanCreationReturnView({
                  ResultCode: ClanCreationResultCode.InvalidClanTag,
                }),
              );
            } else if (this.ProfanityFilter.DetectAllProfanities(createClanData.Motto).length > 0) {
              // "Invalid Clan Motto", "The motto '" + motto + "' is not valid, please modify it."

              ClanCreationReturnViewProxy.Serialize(
                outputStream,
                new ClanCreationReturnView({
                  ResultCode: ClanCreationResultCode.InvalidClanMotto,
                }),
              );
            } else if ((await Clan.findOne({ where: { Tag: createClanData.Tag } })) != null) {
              // "Clan Tag", "The tag '" + tag + "' is already taken, try another one."

              ClanCreationReturnViewProxy.Serialize(
                outputStream,
                new ClanCreationReturnView({
                  ResultCode: ClanCreationResultCode.ClanTagTaken,
                }),
              );
            } else if (
              XpPointsUtil.GetLevelForXp(playerStatistics!.Xp) < 4 &&
              publicProfile.AccessLevel !== MemberAccessLevel.Admin
            ) {
              // "Sorry", "You don't fulfill the minimal requirements to create your own clan."

              ClanCreationReturnViewProxy.Serialize(
                outputStream,
                new ClanCreationReturnView({
                  ResultCode: ClanCreationResultCode.RequirementPlayerLevel,
                }),
              );
            } else if (!friendsList.length && publicProfile.AccessLevel !== MemberAccessLevel.Admin) {
              ClanCreationReturnViewProxy.Serialize(
                outputStream,
                new ClanCreationReturnView({
                  ResultCode: ClanCreationResultCode.RequirementPlayerFriends,
                }),
              );
            } else if (!hasClanLicense && publicProfile.AccessLevel !== MemberAccessLevel.Admin) {
              ClanCreationReturnViewProxy.Serialize(
                outputStream,
                new ClanCreationReturnView({
                  ResultCode: ClanCreationResultCode.RequirementClanLicense,
                }),
              );
            } else {
              const clan = await Clan.create({
                GroupId: Math.randomInt(),
                Name: createClanData.Name,
                Motto: createClanData.Motto,
                FoundingDate: new Date(),
                Type: GroupType.Clan,
                LastUpdated: new Date(),
                Tag: createClanData.Tag,
                MembersLimit: 12,
                ApplicationId: createClanData.ApplicationId,
                OwnerCmid: publicProfile.Cmid,
                OwnerName: publicProfile.Name,
              });

              const clanMember = await ClanMember.create({
                GroupId: clan.GroupId,
                Cmid: publicProfile.Cmid,
                Name: publicProfile.Name,
                Position: GroupPosition.Leader,
                JoiningDate: new Date(),
                Lastlogin: publicProfile.LastLoginDate,
              });

              // Stamp the clan tag on the owner's profile so [TAG] shows in chat (next login).
              await publicProfile.update({ GroupTag: clan.Tag });

              ClanCreationReturnViewProxy.Serialize(
                outputStream,
                new ClanCreationReturnView({
                  ResultCode: ClanCreationResultCode.Success,
                  ClanView: {
                    ...(clan.get({ plain: true }) as ClanView),
                    Members: [clanMember.get({ plain: true }) as ClanMemberView],
                  },
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
      this.handleEndpointError('CreateClan', error);
    }

    return null;
  }

  static async DeclineClanInvitation(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const clanInvitationId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('DeclineClanInvitation', clanInvitationId, authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const groupInvitation = await GroupInvitation.findOne({ where: { GroupInvitationId: clanInvitationId } });

          if (groupInvitation) {
            groupInvitation.destroy();

            ClanRequestDeclineViewProxy.Serialize(
              outputStream,
              new ClanRequestDeclineView({
                ActionResult: ClanActionResultCode.Success,
                ClanRequestId: clanInvitationId,
              }),
            );
          } else {
            ClanRequestDeclineViewProxy.Serialize(
              outputStream,
              new ClanRequestDeclineView({
                ActionResult: ClanActionResultCode.Error,
                ClanRequestId: clanInvitationId,
              }),
            );
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('DeclineClanInvitation', error);
    }

    return null;
  }

  static async DisbandGroup(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const groupId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('DisbandGroup', groupId, authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const clan = await Clan.findOne({
            where: {
              GroupId: groupId,
            },
            include: [
              {
                model: ClanMember,
                as: 'Members',
                required: false,
              },
            ],
          });

          if (clan && clan.Members.find((_) => _.Cmid === steamMember.Cmid && _.Position === GroupPosition.Leader)) {
            Clan.destroy({ where: { GroupId: groupId } });
            Int32Proxy.Serialize(outputStream, 0);
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('DisbandGroup', error);
    }

    return null;
  }

  static async GetAllGroupInvitations(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GetAllGroupInvitations', authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const groupInvitations = await GroupInvitation.findAll({ where: { InviteeCmid: steamMember.Cmid } });

          ListProxy.Serialize<GroupInvitationView>(
            outputStream,
            groupInvitations as GroupInvitationView[],
            GroupInvitationViewProxy.Serialize,
          );
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GetAllGroupInvitations', error);
    }

    return null;
  }

  static async GetMyClanId(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GetMyClanId', authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const clans = await Clan.findAll({
            include: [
              {
                model: ClanMember,
                as: 'Members',
              },
            ],
          });

          for (const clan of clans) {
            if (await clan.Members.find((_) => _.Cmid === steamMember.Cmid)) {
              Int32Proxy.Serialize(outputStream, clan.GroupId);

              break;
            }
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GetMyClanId', error);
    }

    return null;
  }

  static async GetOwnClan(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GetOwnClan', authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const clans = await Clan.findAll({
            include: [
              {
                model: ClanMember,
                as: 'Members',
                required: false,
              },
            ],
          });

          for (const clan of clans) {
            if (clan.Members.find((_) => _.Cmid === steamMember.Cmid)) {
              ClanViewProxy.Serialize(outputStream, new ClanView({ ...(clan.get({ plain: true }) as ClanView) }));

              break;
            }
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GetOwnClan', error);
    }

    return null;
  }

  static async GetPendingGroupInvitations(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const groupId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GetPendingGroupInvitations', authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const groupInvitations = await GroupInvitation.findAll({
            where: { GroupId: groupId, InviterCmid: steamMember.Cmid },
          });

          ListProxy.Serialize<GroupInvitationView>(
            outputStream,
            groupInvitations as GroupInvitationView[],
            GroupInvitationViewProxy.Serialize,
          );
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GetPendingGroupInvitations', error);
    }

    return null;
  }

  static async InviteMemberToJoinAGroup(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const clanId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);
      const inviteeCmid = Int32Proxy.Deserialize(bytes);
      const message = StringProxy.Deserialize(bytes);

      this.debugEndpoint('InviteMemberToJoinAGroup', authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });
          const inviteeProfile = await PublicProfile.findOne({ where: { Cmid: inviteeCmid } });

          if (publicProfile && inviteeProfile) {
            const clan = await Clan.findOne({ where: { GroupId: clanId } });

            if (
              clan != null &&
              (await ClanMember.findOne({ where: { GroupId: clanId, Cmid: inviteeCmid } })) == null &&
              (await GroupInvitation.findOne({ where: { GroupId: clanId, InviteeCmid: inviteeCmid } })) == null
            ) {
              await GroupInvitation.create({
                InviterCmid: publicProfile.Cmid,
                InviterName: publicProfile.Name,
                GroupName: clan.Name,
                GroupTag: clan.Tag,
                GroupId: clan.GroupId,
                GroupInvitationId: Math.randomInt(),
                InviteeCmid: inviteeCmid,
                InviteeName: inviteeProfile.Name,
                Message: message,
              });

              Int32Proxy.Serialize(outputStream, ClanActionResultCode.Success);
            }
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('InviteMemberToJoinAGroup', error);
    }

    return null;
  }

  static async KickMemberFromClan(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const groupId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);
      const cmidToKick = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('KickMemberFromClan', groupId, authToken, cmidToKick);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (!steamMember) {
          Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
        } else {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });
          const toKickProfile = await PublicProfile.findOne({ where: { Cmid: cmidToKick } });

          if (!publicProfile || !toKickProfile) {
            Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
          } else {
            const clan = await Clan.findOne({
              where: {
                GroupId: groupId,
              },
              include: [
                {
                  model: ClanMember,
                  as: 'Members',
                  required: false,
                },
              ],
            });

            if (!clan) {
              Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
            } else {
              const clanMember = clan.Members.find((_) => _.Cmid === publicProfile.Cmid);
              const memberToKick = clan.Members.find((_) => _.Cmid === cmidToKick);

              if (
                !clanMember ||
                !memberToKick ||
                (memberToKick.Position === GroupPosition.Officer && clanMember.Position !== GroupPosition.Leader) ||
                (memberToKick.Position === GroupPosition.Member &&
                  !(clanMember.Position === GroupPosition.Officer || clanMember.Position === GroupPosition.Leader))
              ) {
                Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
              } else {
                await memberToKick.destroy();
                await toKickProfile.update({ GroupTag: '' });

                Int32Proxy.Serialize(outputStream, ClanActionResultCode.Success);
              }
            }
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('KickMemberFromClan', error);
    }

    return null;
  }

  static async LeaveAClan(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const groupId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('LeaveAClan', groupId, authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (!steamMember) {
          Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
        } else {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });

          if (!publicProfile) {
            Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
          } else {
            const clan = await Clan.findOne({
              where: {
                GroupId: groupId,
              },
              include: [
                {
                  model: ClanMember,
                  as: 'Members',
                  required: false,
                },
              ],
            });

            if (!clan) {
              Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
            } else {
              const clanMember = clan.Members.find((_) => _.Cmid === publicProfile.Cmid);

              if (!clanMember || clanMember.Position !== GroupPosition.Leader) {
                Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
              } else {
                await clanMember.destroy();
                await publicProfile.update({ GroupTag: '' });

                Int32Proxy.Serialize(outputStream, ClanActionResultCode.Success);
              }
            }
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('LeaveAClan', error);
    }

    return null;
  }

  static async TransferOwnership(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const groupId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);
      const newLeaderCmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('TransferOwnership', groupId, authToken, newLeaderCmid);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (!steamMember) {
          Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
        } else {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });
          const newLeaderProfile = await PublicProfile.findOne({ where: { Cmid: newLeaderCmid } });

          if (!publicProfile || !newLeaderProfile) {
            Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
          } else {
            const clan = await Clan.findOne({
              where: {
                GroupId: groupId,
              },
              include: [
                {
                  model: ClanMember,
                  as: 'Members',
                  required: false,
                },
              ],
            });

            if (!clan) {
              Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
            } else {
              const clanMember = clan!.Members.find((_) => _.Cmid === publicProfile.Cmid);
              const newLeader = clan!.Members.find((_) => _.Cmid === newLeaderCmid);

              if (!clanMember || !newLeader || clanMember.Position !== GroupPosition.Leader) {
                Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
              } else {
                const friendsList = await ContactRequest.findAll({
                  where: {
                    [Op.or]: {
                      InitiatorCmid: newLeaderProfile.Cmid,
                      ReceiverCmid: newLeaderProfile.Cmid,
                    },
                    Status: ContactRequestStatus.Accepted,
                  },
                });
                const playerStatistics = await PlayerStatistics.findOne({ where: { Cmid: newLeaderProfile.Cmid } });
                const hasClanLicense =
                  (await PlayerInventoryItem.findOne({
                    where: { Cmid: newLeaderProfile.Cmid, ItemId: UberstrikeInventoryItem.ClanLicense },
                  })) != null;

                if (XpPointsUtil.GetLevelForXp(playerStatistics!.Xp) < 4) {
                  Int32Proxy.Serialize(outputStream, ClanCreationResultCode.RequirementPlayerLevel);
                } else if (friendsList.length < 1) {
                  Int32Proxy.Serialize(outputStream, ClanCreationResultCode.RequirementPlayerFriends);
                } else if (!hasClanLicense) {
                  Int32Proxy.Serialize(outputStream, ClanCreationResultCode.RequirementClanLicense);
                } else {
                  await clan.update({
                    OwnerCmid: newLeaderProfile.Cmid,
                    OwnerName: newLeaderProfile.Name,
                  });

                  clanMember.Position = newLeader.Position;
                  newLeader.Position = GroupPosition.Leader;

                  await clanMember.update({
                    Position: newLeader.Position,
                  });

                  await newLeader.update({
                    Position: GroupPosition.Leader,
                  });

                  Int32Proxy.Serialize(outputStream, ClanActionResultCode.Success);
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
      this.handleEndpointError('TransferOwnership', error);
    }

    return null;
  }

  static async UpdateMemberPosition(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const updateMemberPositionData = MemberPositionUpdateViewProxy.Deserialize(bytes);

      this.debugEndpoint('UpdateMemberPosition', updateMemberPositionData);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(
        updateMemberPositionData.AuthToken,
      );
      if (session) {
        const steamMember = await session.SteamMember;

        if (!steamMember) {
          Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
        } else {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });
          const targetProfile = await PublicProfile.findOne({ where: { Cmid: updateMemberPositionData.MemberCmid } });

          if (!publicProfile || !targetProfile) {
            Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
          } else {
            const clan = await Clan.findOne({
              where: {
                GroupId: updateMemberPositionData.GroupId,
              },
              include: [
                {
                  model: ClanMember,
                  as: 'Members',
                  required: false,
                },
              ],
            });

            if (!clan) {
              Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
            } else {
              const clanMember = clan.Members.find((_) => _.Cmid === publicProfile.Cmid);
              const targetClanMember = clan.Members.find((_) => _.Cmid === targetProfile.Cmid);

              if (
                !clanMember ||
                !targetClanMember ||
                (targetClanMember.Position === GroupPosition.Officer && clanMember.Position !== GroupPosition.Leader) ||
                (targetClanMember.Position === GroupPosition.Member &&
                  !(clanMember.Position === GroupPosition.Officer || clanMember.Position === GroupPosition.Leader))
              ) {
                Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
              } else {
                await targetClanMember.update({
                  Position: updateMemberPositionData.Position,
                });

                Int32Proxy.Serialize(outputStream, ClanActionResultCode.Success);
              }
            }
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('UpdateMemberPosition', error);
    }

    return null;
  }
}
