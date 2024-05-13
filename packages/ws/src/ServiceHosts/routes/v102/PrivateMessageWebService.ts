import { ApiVersion } from '@/utils';
import { PrivateMessage, PublicProfile, UserAccount } from '@festivaldev/paradise-models';
import { MessageThreadView } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { Int32Proxy, ListProxy, StringProxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import { MessageThreadViewProxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization/Legacy';
import { Op } from 'sequelize';
import BaseWebService from '../BaseWebService';

export default class PrivateMessageWebService extends BaseWebService {
  public static get ServiceName(): string {
    return 'PrivateMessageWebService';
  }
  public static get ServiceVersion(): string {
    return ApiVersion.Legacy102;
  }
  // protected static get ServiceInterface(): string { return 'IPrivateMessageWebServiceContract'; }

  public static async GetAllMessageThreadsForUser_1(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetAllMessageThreadsForUser_1', cmid);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetAllMessageThreadsForUser_1', e);
    }

    return null;
  }

  public static async GetAllMessageThreadsForUser_2(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const cmid = Int32Proxy.Deserialize(bytes);
      const pageNumber = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetAllMessageThreadsForUser_2', cmid, pageNumber);

      const userAccount = await UserAccount.findOne({ where: { Cmid: cmid } });

      if (userAccount) {
        const messages = (
          await PrivateMessage.findAll({
            where: {
              [Op.or]: {
                FromCmid: userAccount.Cmid,
                ToCmid: userAccount.Cmid,
              },
            },
          })
        ).reduce((acc: any, curr: PrivateMessage) => {
          const threadId = [curr.FromCmid, curr.ToCmid].sort().join(',');

          if (!acc[threadId]) {
            acc[threadId] = [];
          }

          acc[threadId].push(curr);
          return acc;
        }, {});

        const threads: List<MessageThreadView> = [];

        for (const messageGroup of Object.values(messages)) {
          const filteredMessages = (messageGroup as any).find(
            (_: PrivateMessage) =>
              (_.FromCmid === userAccount.Cmid && !_.IsDeletedBySender) ||
              (_.ToCmid === userAccount.Cmid && !_.IsDeletedByReceiver),
          );

          if (filteredMessages.length) {
            const message = filteredMessages[filteredMessages.length - 1];

            const otherCmid = message.FromCmid !== userAccount.Cmid ? message.FromCmid : message.ToCmid;
            const otherProfile = await PublicProfile.findOne({ where: { Cmid: otherCmid } });

            if (otherProfile) {
              threads.push(
                new MessageThreadView({
                  ThreadId: otherCmid,
                  ThreadName: otherProfile.Name,
                  MessageCount: filteredMessages.length,
                  LastMessagePreview: message.ContentText,
                  LastUpdate: message.DateSent,
                  HasNewMessages: filteredMessages.some(
                    (_: PrivateMessage) => _.ToCmid === userAccount.Cmid && !_.IsRead,
                  ),
                }),
              );
            }
          }
        }

        ListProxy.Serialize<MessageThreadView>(outputStream, threads, MessageThreadViewProxy.Serialize);
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetAllMessageThreadsForUser_2', e);
    }

    return null;
  }

  public static async GetThreadMessages(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const threadViewerCmid = Int32Proxy.Deserialize(bytes);
      const otherCmid = Int32Proxy.Deserialize(bytes);
      const pageNumber = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetThreadMessages', threadViewerCmid, otherCmid, pageNumber);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetThreadMessages', e);
    }

    return null;
  }

  public static async SendMessage(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const senderCmid = Int32Proxy.Deserialize(bytes);
      const receiverCmid = Int32Proxy.Deserialize(bytes);
      const content = StringProxy.Deserialize(bytes);

      this.debugEndpoint('SendMessage', senderCmid, receiverCmid, content);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('SendMessage', e);
    }

    return null;
  }

  public static async GetMessageWithId(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const messageId = Int32Proxy.Deserialize(bytes);
      const requesterCmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('GetMessageWithId', messageId, requesterCmid);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('GetMessageWithId', e);
    }

    return null;
  }

  public static async MarkThreadAsRead(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const threadViewerCmid = Int32Proxy.Deserialize(bytes);
      const otherCmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('MarkThreadAsRead', threadViewerCmid, otherCmid);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('MarkThreadAsRead', e);
    }

    return null;
  }

  public static async DeleteThread(data: byte[], outputStream: MemoryStream): Promise<byte[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

    try {
      const threadViewerCmid = Int32Proxy.Deserialize(bytes);
      const otherCmid = Int32Proxy.Deserialize(bytes);

      this.debugEndpoint('DeleteThread', threadViewerCmid, otherCmid);

      throw new Error('Not Implemented');
      // return isEncrypted
      //   ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
      //   : outputStream;
    } catch (e) {
      this.handleEndpointError('DeleteThread', e);
    }

    return null;
  }
}
