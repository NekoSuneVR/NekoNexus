import ParadiseService from '@/ParadiseService';
import { ContactRequest, PublicProfile } from '@/models';
import { ApiVersion } from '@/utils';
import {
  ContactGroupView,
  ContactRequestStatus,
  ContactRequestView,
  MemberOperationResult,
  PublicProfileView,
} from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  BooleanProxy,
  ContactGroupViewProxy,
  ContactRequestViewProxy,
  EnumProxy,
  Int32Proxy,
  ListProxy,
  PublicProfileViewProxy,
  StringProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import { Op } from 'sequelize';
import BaseWebService from '../BaseWebService';

export default class RelationshipWebService extends BaseWebService {
  public static get ServiceName(): string {
    return 'RelationshipWebService';
  }
  public static get ServiceVersion(): string {
    return ApiVersion.Current;
  }
  // protected static get ServiceInterface(): string { return 'IRelationshipWebServiceContract'; }

  public static async AcceptContactRequest(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);
      const contactRequestId = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('AcceptContactRequest', authToken, contactRequestId);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const contactRequest = await ContactRequest.findOne({
            where: { RequestId: contactRequestId, ReceiverCmid: steamMember.Cmid },
          });

          if (contactRequest) {
            const initiatorProfile = await PublicProfile.findOne({ where: { Cmid: contactRequest.InitiatorCmid } });
            const receiverProfile = await PublicProfile.findOne({ where: { Cmid: contactRequest.ReceiverCmid } });

            if (initiatorProfile && receiverProfile) {
              await contactRequest.update({
                Status: ContactRequestStatus.Accepted,
              });

              PublicProfileViewProxy.Serialize(
                outputStream,
                new PublicProfileView({ ...initiatorProfile.get({ plain: true }) }),
              );
            }
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('AcceptContactRequest', error);
    }

    return null;
  }

  public static async DeclineContactRequest(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);
      const contactRequestId = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('DeclineContactRequest', authToken, contactRequestId);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const contactRequest = await ContactRequest.findOne({
            where: { RequestId: contactRequestId, ReceiverCmid: steamMember.Cmid },
          });

          if (contactRequest) {
            await contactRequest.update({
              Status: ContactRequestStatus.Refused,
            });

            BooleanProxy.Serialize(outputStream, true);
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('DeclineContactRequest', error);
    }

    return null;
  }

  public static async DeleteContact(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);
      const contactCmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('DeleteContact', authToken, contactCmid);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          if (
            await ContactRequest.destroy({
              where: {
                [Op.or]: [
                  {
                    ReceiverCmid: steamMember.Cmid,
                    InitiatorCmid: contactCmid,
                  },
                  {
                    InitiatorCmid: steamMember.Cmid,
                    ReceiverCmid: contactCmid,
                  },
                ],
                Status: ContactRequestStatus.Accepted,
              },
            })
          ) {
            EnumProxy.Serialize<MemberOperationResult>(outputStream, MemberOperationResult.Ok);
          } else {
            EnumProxy.Serialize<MemberOperationResult>(outputStream, MemberOperationResult.InvalidCmid);
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('DeleteContact', error);
    }

    return null;
  }

  public static async GetContactRequests(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);

      this.debugEndpoint('GetContactRequests', authToken);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const contactRequests = await ContactRequest.findAll({
            where: {
              ReceiverCmid: steamMember.Cmid,
              Status: ContactRequestStatus.Pending,
            },
          });

          ListProxy.Serialize<ContactRequestView>(
            outputStream,
            contactRequests as ContactRequestView[],
            ContactRequestViewProxy.Serialize,
          );
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GetContactRequests', error);
    }

    return null;
  }

  public static async GetContactsByGroups(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);
      const populateFacebookIds = BooleanProxy.Deserialize(bytes);

      this.debugEndpoint('GetContactsByGroups', authToken, populateFacebookIds);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const contactRequests = await ContactRequest.findAll({
            where: {
              [Op.or]: {
                ReceiverCmid: steamMember.Cmid,
                InitiatorCmid: steamMember.Cmid,
              },
              Status: ContactRequestStatus.Accepted,
            },
          });

          const contacts: List<ContactGroupView> = [];

          for (const contactRequest of contactRequests) {
            contacts.push(
              new ContactGroupView({
                GroupId: steamMember.Cmid,
                Contacts: [
                  await PublicProfile.findOne({
                    where: {
                      Cmid:
                        contactRequest.InitiatorCmid !== steamMember.Cmid
                          ? contactRequest.InitiatorCmid
                          : contactRequest.ReceiverCmid,
                    },
                    raw: true,
                  }),
                ],
              }),
            );
          }

          ListProxy.Serialize<ContactGroupView>(outputStream, contacts, ContactGroupViewProxy.Serialize);
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('GetContactsByGroups', error);
    }

    return null;
  }

  public static async SendContactRequest(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const authToken = StringProxy.Deserialize(bytes);
      const receiverCmid = Int32Proxy.Deserialize(bytes);
      const message = StringProxy.Deserialize(bytes);

      this.debugEndpoint('SendContactRequest', authToken, receiverCmid, message);

      const session = await ParadiseService.Instance.SessionManager.findSessionForSteamUser(authToken);
      if (session) {
        const steamMember = await session.SteamMember;

        if (steamMember) {
          const playerProfile = await PublicProfile.findOne({ where: { Cmid: steamMember.Cmid } });
          const contactRequest = await ContactRequest.findOne({
            where: {
              InitiatorCmid: steamMember.Cmid,
              ReceiverCmid: receiverCmid,
            },
          });

          if (!contactRequest) {
            await ContactRequest.create({
              RequestId: Math.randomInt(),
              InitiatorCmid: steamMember.Cmid,
              InitiatorName: playerProfile!.Name,
              InitiatorMessage: message,
              ReceiverCmid: receiverCmid,
              SentDate: new Date(),
            });
          }
        }
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (error) {
      this.handleEndpointError('SendContactRequest', error);
    }

    return null;
  }
}
