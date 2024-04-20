import { ContactRequest, PublicProfile, UserAccount } from '@/models';
import { ApiVersion } from '@/utils';
import { ContactGroupView, ContactRequestStatus, ContactRequestView } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { ContactRequestViewProxy, Int32Proxy, ListProxy, StringProxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import { ContactGroupViewProxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization/Legacy';
import { Op } from 'sequelize';
import BaseWebService from '../BaseWebService';

export default class RelationshipWebService extends BaseWebService {
  public static get ServiceName(): string { return 'RelationshipWebService'; }
  public static get ServiceVersion(): string { return ApiVersion.Legacy102; }
  // protected static get ServiceInterface(): string { return 'IRelationshipWebServiceContract'; }

  public static async SendContactRequest(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const initiatorCmid = Int32Proxy.Deserialize(bytes);
      const receiverCmid = Int32Proxy.Deserialize(bytes);
      const message = StringProxy.Deserialize(bytes);

      this.debugEndpoint('SendContactRequest', initiatorCmid, receiverCmid, message);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('SendContactRequest', e);
    }

    return null;
  }

  public static async GetContactRequests(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetContactRequests', cmid);

      const userAccount = await UserAccount.findOne({ where: { Cmid: cmid } });

      if (userAccount) {
        const contactRequests = await ContactRequest.findAll({
          where: {
            ReceiverCmid: userAccount.Cmid,
            Status: ContactRequestStatus.Pending,
          },
        });

        ListProxy.Serialize<ContactRequestView>(outputStream, contactRequests as ContactRequestView[], ContactRequestViewProxy.Serialize);
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetContactRequests', e);
    }

    return null;
  }

  public static async AcceptContactRequest(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const contactRequestId = Int32Proxy.Deserialize(bytes);
      const cmid = Int32Proxy.Deserialize(bytes);
      const applicationId = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('AcceptContactRequest', contactRequestId, cmid, applicationId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('AcceptContactRequest', e);
    }

    return null;
  }

  public static async DeclineContactRequest(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const contactRequestId = Int32Proxy.Deserialize(bytes);
      const cmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('DeclineContactRequest', contactRequestId, cmid);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('DeclineContactRequest', e);
    }

    return null;
  }

  public static async DeleteContact(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const contactCmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('DeleteContact', cmid, contactCmid);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('DeleteContact', e);
    }

    return null;
  }

  public static async MoveContactToGroup(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const contactCmid = Int32Proxy.Deserialize(bytes);
      const previousGroupId = Int32Proxy.Deserialize(bytes);
      const newGroupId = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('MoveContactToGroup', cmid, contactCmid, previousGroupId, newGroupId);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('MoveContactToGroup', e);
    }

    return null;
  }

  public static async GetContactsByGroups(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector) : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const applicationId = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetContactsByGroups', cmid, applicationId);

      const userAccount = await UserAccount.findOne({ where: { Cmid: cmid } });

      if (userAccount) {
        const contactRequests = await ContactRequest.findAll({
          where: {
            [Op.or]: {
              ReceiverCmid: userAccount.Cmid,
              InitiatorCmid: userAccount.Cmid,
            },
            Status: ContactRequestStatus.Accepted,
          },
        });

        const contacts: List<ContactGroupView> = [];

        for (const contactRequest of contactRequests) {
          contacts.push(new ContactGroupView({
            GroupId: userAccount.Cmid,
            Contacts: [
              await PublicProfile.findOne({
                where: { Cmid: (contactRequest.InitiatorCmid !== userAccount.Cmid ? contactRequest.InitiatorCmid : contactRequest.ReceiverCmid) },
                raw: true,
              })
            ],
          }));
        }

        ListProxy.Serialize<ContactGroupView>(outputStream, contacts, ContactGroupViewProxy.Serialize);
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetContactsByGroups', e);
    }

    return null;
  }
}
