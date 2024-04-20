import { ProfanityFilter } from '@/ProfanityFilter';
import {
  Clan, ClanMember, ContactRequest, GroupInvitation, PlayerInventoryItem, PlayerStatistics, PublicProfile,
} from '@/models';
import { ApiVersion, UberstrikeInventoryItem, XpPointsUtil } from '@/utils';
import {
  ClanCreationReturnView,
  ClanRequestAcceptView, ClanRequestDeclineView, ClanView, ContactRequestStatus, GroupInvitationView, GroupPosition, GroupType, MemberAccessLevel,
} from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  ClanCreationReturnViewProxy, ClanRequestAcceptViewProxy, ClanRequestDeclineViewProxy, ClanViewProxy, GroupCreationViewProxy, GroupInvitationViewProxy, Int32Proxy, ListProxy, MemberPositionUpdateViewProxy, StringProxy,
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
  RequirementClanLicense
}

enum ClanActionResultCode {
  Success,
  Error
}

export default class ClanWebService extends BaseWebService {
  public static get ServiceName(): string { return 'ClanWebService'; }
  public static get ServiceVersion(): string { return ApiVersion.Current; }
  // protected static get ServiceInterface(): string { return 'IClanWebServiceContract'; }

  private static readonly ProfanityFilter: ProfanityFilter = new ProfanityFilter();

  public static async AcceptClanInvitation(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const clanInvitationId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('AcceptClanInvitation', clanInvitationId, authToken);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
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
                  Cmid: publicProfile.Cmid,
                  Name: publicProfile.Name,
                  Position: GroupPosition.Member,
                  Lastlogin: publicProfile.LastLoginDate,
                });

                groupInvitation.destroy();

                ClanRequestAcceptViewProxy.Serialize(outputStream, new ClanRequestAcceptView({
                  ActionResult: ClanActionResultCode.Success,
                  ClanRequestId: clanInvitationId,
                  ClanView: clan.get({ plain: true }),
                }));

                return isEncrypted
                  ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
                  : outputStream;
              }
            }
          }
        }

        ClanRequestAcceptViewProxy.Serialize(outputStream, new ClanRequestAcceptView({
          ActionResult: ClanActionResultCode.Error,
          ClanRequestId: clanInvitationId,
        }));
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('AcceptClanInvitation', error);
    }

    return null;
  }

  public static async CancelInvitation(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const groupInvitationId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('CancelInvitation', groupInvitationId, authToken);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
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

  public static async CanOwnClan(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

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

  public static async CreateClan(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const createClanData = GroupCreationViewProxy.Deserialize(bytes);

      this.debugEndpoint('CreateClan', createClanData);

      const session = await global.SessionManager.findSessionForSteamUser(createClanData.AuthToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });

          if (publicProfile) {
            if (await ClanMember.findOne({ where: { Cmid: steamMember.Cmid } })) {
              // "Clan Collision", "You are already member of another clan, please leave first before creating your own."

              ClanCreationReturnViewProxy.Serialize(outputStream, new ClanCreationReturnView({
                ResultCode: ClanCreationResultCode.ClanCollision,
              }));

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
            const hasClanLicense = (await PlayerInventoryItem.findOne({ where: { Cmid: steamMember.Cmid, ItemId: UberstrikeInventoryItem.ClanLicense } })) != null;

            if (createClanData.Name.length < 3 || !createClanData.Name.match(/^[a-zA-Z0-9_]+$/) || this.ProfanityFilter.DetectAllProfanities(createClanData.Name).length > 0) {
              // "Invalid Clan Name", "The name '" + name + "' is not valid, please modify it."

              ClanCreationReturnViewProxy.Serialize(outputStream, new ClanCreationReturnView({
                ResultCode: ClanCreationResultCode.InvalidClanName,
              }));
            } else if (await Clan.findOne({ where: { Name: createClanData.Name } })) {
              // "Clan Name", "The name '" + name + "' is already taken, try another one."

              ClanCreationReturnViewProxy.Serialize(outputStream, new ClanCreationReturnView({
                ResultCode: ClanCreationResultCode.ClanNameTaken,
              }));
            } else if (this.ProfanityFilter.DetectAllProfanities(createClanData.Tag).length > 0) {
              // "Invalid Clan Tag", "The tag '" + tag + "' is not valid, please modify it."

              ClanCreationReturnViewProxy.Serialize(outputStream, new ClanCreationReturnView({
                ResultCode: ClanCreationResultCode.InvalidClanTag,
              }));
            } else if (this.ProfanityFilter.DetectAllProfanities(createClanData.Motto).length > 0) {
              // "Invalid Clan Motto", "The motto '" + motto + "' is not valid, please modify it."

              ClanCreationReturnViewProxy.Serialize(outputStream, new ClanCreationReturnView({
                ResultCode: ClanCreationResultCode.InvalidClanMotto,
              }));
            } else if (await Clan.findOne({ where: { Tag: createClanData.Tag } }) != null) {
              // "Clan Tag", "The tag '" + tag + "' is already taken, try another one."

              ClanCreationReturnViewProxy.Serialize(outputStream, new ClanCreationReturnView({
                ResultCode: ClanCreationResultCode.ClanTagTaken,
              }));
            } else if (XpPointsUtil.GetLevelForXp(playerStatistics!.Xp) < 4 && publicProfile.AccessLevel !== MemberAccessLevel.Admin) {
              // "Sorry", "You don't fulfill the minimal requirements to create your own clan."

              ClanCreationReturnViewProxy.Serialize(outputStream, new ClanCreationReturnView({
                ResultCode: ClanCreationResultCode.RequirementPlayerLevel,
              }));
            } else if (!friendsList.length && publicProfile.AccessLevel !== MemberAccessLevel.Admin) {
              ClanCreationReturnViewProxy.Serialize(outputStream, new ClanCreationReturnView({
                ResultCode: ClanCreationResultCode.RequirementPlayerFriends,
              }));
            } else if (!hasClanLicense && publicProfile.AccessLevel !== MemberAccessLevel.Admin) {
              ClanCreationReturnViewProxy.Serialize(outputStream, new ClanCreationReturnView({
                ResultCode: ClanCreationResultCode.RequirementClanLicense,
              }));
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

              ClanCreationReturnViewProxy.Serialize(outputStream, new ClanCreationReturnView({
                ResultCode: ClanCreationResultCode.Success,
                ClanView: {
                  ...clan.get({ plain: true }),
                  Members: [
                    clanMember.get({ plain: true }),
                  ],
                },
              }));
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

  public static async DeclineClanInvitation(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const clanInvitationId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('DeclineClanInvitation', clanInvitationId, authToken);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const groupInvitation = await GroupInvitation.findOne({ where: { GroupInvitationId: clanInvitationId } });

          if (groupInvitation) {
            groupInvitation.destroy();

            ClanRequestDeclineViewProxy.Serialize(outputStream, new ClanRequestDeclineView({
              ActionResult: ClanActionResultCode.Success,
              ClanRequestId: clanInvitationId,
            }));
          } else {
            ClanRequestDeclineViewProxy.Serialize(outputStream, new ClanRequestDeclineView({
              ActionResult: ClanActionResultCode.Error,
              ClanRequestId: clanInvitationId,
            }));
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

  public static async DisbandGroup(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const groupId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('DisbandGroup', groupId, authToken);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const clan = await Clan.findOne({
            where: {
              GroupId: groupId,
            },
            include: [{
              model: ClanMember,
              as: 'Members',
              required: false,
            }],
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

  public static async GetAllGroupInvitations(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GetAllGroupInvitations', authToken);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const groupInvitations = await GroupInvitation.findAll({ where: { InviteeCmid: steamMember.Cmid } });

          ListProxy.Serialize<GroupInvitationView>(outputStream, (groupInvitations as GroupInvitationView[]), GroupInvitationViewProxy.Serialize);
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

  public static async GetMyClanId(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GetMyClanId', authToken);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const clans = await Clan.findAll({
            include: [{
              model: ClanMember,
              as: 'Members',
            }],
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

  public static async GetOwnClan(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GetOwnClan', authToken);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const clans = await Clan.findAll({
            include: [{
              model: ClanMember,
              as: 'Members',
              required: false,
            }],
          });

          for (const clan of clans) {
            if (clan.Members.find((_) => _.Cmid === steamMember.Cmid)) {
              ClanViewProxy.Serialize(outputStream, new ClanView({ ...clan.get({ plain: true }) }));

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

  public static async GetPendingGroupInvitations(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const groupId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GetPendingGroupInvitations', authToken);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const groupInvitations = await GroupInvitation.findAll({ where: { GroupId: groupId, InviterCmid: steamMember.Cmid } });

          ListProxy.Serialize<GroupInvitationView>(outputStream, (groupInvitations as GroupInvitationView[]), GroupInvitationViewProxy.Serialize);
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

  public static async InviteMemberToJoinAGroup(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const clanId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);
      const inviteeCmid = Int32Proxy.Deserialize(bytes);
      const message = StringProxy.Deserialize(bytes);

      this.debugEndpoint('InviteMemberToJoinAGroup', authToken);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const publicProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });
          const inviteeProfile = await PublicProfile.findOne({ where: { Cmid: inviteeCmid } });

          if (publicProfile && inviteeProfile) {
            const clan = await Clan.findOne({ where: { GroupId: clanId } });

            if (clan != null
              && (await ClanMember.findOne({ where: { GroupId: clanId, Cmid: inviteeCmid } })) == null
              && (await GroupInvitation.findOne({ where: { GroupId: clanId, InviteeCmid: inviteeCmid } })) == null) {
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

  public static async KickMemberFromClan(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const groupId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);
      const cmidToKick = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('KickMemberFromClan', groupId, authToken, cmidToKick);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
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
              include: [{
                model: ClanMember,
                as: 'Members',
                required: false,
              }],
            });

            if (!clan) {
              Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
            } else {
              const clanMember = clan.Members.find((_) => _.Cmid === publicProfile.Cmid);
              const memberToKick = clan.Members.find((_) => _.Cmid === cmidToKick);

              if ((!clanMember || !memberToKick)
                || (memberToKick.Position === GroupPosition.Officer && clanMember.Position !== GroupPosition.Leader)
                || (memberToKick.Position === GroupPosition.Member && !(clanMember.Position === GroupPosition.Officer || clanMember.Position === GroupPosition.Leader))) {
                Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
              } else {
                await memberToKick.destroy();

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

  public static async LeaveAClan(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const groupId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('LeaveAClan', groupId, authToken);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
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
              include: [{
                model: ClanMember,
                as: 'Members',
                required: false,
              }],
            });

            if (!clan) {
              Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
            } else {
              const clanMember = clan.Members.find((_) => _.Cmid === publicProfile.Cmid);

              if (!clanMember || clanMember.Position !== GroupPosition.Leader) {
                Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
              } else {
                await clanMember.destroy();

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

  public static async TransferOwnership(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const groupId = Int32Proxy.Deserialize(bytes);
      const authToken = StringProxy.Deserialize(bytes);
      const newLeaderCmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('TransferOwnership', groupId, authToken, newLeaderCmid);

      const session = await global.SessionManager.findSessionForSteamUser(authToken);
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
              include: [{
                model: ClanMember,
                as: 'Members',
                required: false,
              }],
            });

            if (!clan) {
              Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
            } else {
              const clanMember = clan!.Members.find((_) => _.Cmid === publicProfile.Cmid);
              const newLeader = clan!.Members.find((_) => _.Cmid === newLeaderCmid);

              if ((!clanMember || !newLeader) || clanMember.Position !== GroupPosition.Leader) {
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
                const hasClanLicense = (await PlayerInventoryItem.findOne({ where: { Cmid: newLeaderProfile.Cmid, ItemId: UberstrikeInventoryItem.ClanLicense } })) != null;

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

  public static async UpdateMemberPosition(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const updateMemberPositionData = MemberPositionUpdateViewProxy.Deserialize(bytes);

      this.debugEndpoint('UpdateMemberPosition', updateMemberPositionData);

      const session = await global.SessionManager.findSessionForSteamUser(updateMemberPositionData.AuthToken);
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
              include: [{
                model: ClanMember,
                as: 'Members',
                required: false,
              }],
            });

            if (!clan) {
              Int32Proxy.Serialize(outputStream, ClanActionResultCode.Error);
            } else {
              const clanMember = clan.Members.find((_) => _.Cmid === publicProfile.Cmid);
              const targetClanMember = clan.Members.find((_) => _.Cmid === targetProfile.Cmid);

              if ((!clanMember || !targetClanMember)
                || (targetClanMember.Position === GroupPosition.Officer && clanMember.Position !== GroupPosition.Leader)
                || (targetClanMember.Position === GroupPosition.Member && !(clanMember.Position === GroupPosition.Officer || clanMember.Position === GroupPosition.Leader))) {
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
