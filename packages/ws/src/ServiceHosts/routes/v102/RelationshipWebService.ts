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

import { ApiVersion } from '@/utils/enums';
import { ContactRequest, PublicProfile, UserAccount } from '@festivaldev/paradise-models';
import {
  ContactGroupView,
  ContactRequestStatus,
  ContactRequestView,
  type PublicProfileView,
} from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  ContactRequestViewProxy,
  Int32Proxy,
  ListProxy,
  StringProxy,
} from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization';
import { ContactGroupViewProxy } from '@festivaldev/uberstrike-js/UberStrike/Core/Serialization/Legacy';
import { Op } from 'sequelize';
import BaseWebService from '../BaseWebService';

export default class RelationshipWebService extends BaseWebService {
  static get ServiceName(): string {
    return 'RelationshipWebService';
  }
  static get ServiceVersion(): string {
    return ApiVersion.Legacy102;
  }
  // protected static get ServiceInterface(): string { return 'IRelationshipWebServiceContract'; }

  static async SendContactRequest(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

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

  static async GetContactRequests(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

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

        ListProxy.Serialize<ContactRequestView>(
          outputStream,
          contactRequests as ContactRequestView[],
          ContactRequestViewProxy.Serialize,
        );
      }

      return isEncrypted
        ? this.CryptoPolicy.RijndaelEncrypt(outputStream, this.EncryptionPassPhrase, this.EncryptionInitVector)
        : outputStream;
    } catch (e) {
      this.handleEndpointError('GetContactRequests', e);
    }

    return null;
  }

  static async AcceptContactRequest(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

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

  static async DeclineContactRequest(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

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

  static async DeleteContact(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

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

  static async MoveContactToGroup(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

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

  static async GetContactsByGroups(data: number[], outputStream: number[]): Promise<number[] | null> {
    const isEncrypted = this.isEncrypted(data);
    const bytes = isEncrypted
      ? this.CryptoPolicy.RijndaelDecrypt(data, this.EncryptionPassPhrase, this.EncryptionInitVector)
      : data;

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

        const contacts: ContactGroupView[] = [];

        for (const contactRequest of contactRequests) {
          contacts.push(
            new ContactGroupView({
              GroupId: userAccount.Cmid,
              Contacts: [
                (await PublicProfile.findOne({
                  where: {
                    Cmid:
                      contactRequest.InitiatorCmid !== userAccount.Cmid
                        ? contactRequest.InitiatorCmid
                        : contactRequest.ReceiverCmid,
                  },
                  raw: true,
                })) as PublicProfileView,
              ],
            }),
          );
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
