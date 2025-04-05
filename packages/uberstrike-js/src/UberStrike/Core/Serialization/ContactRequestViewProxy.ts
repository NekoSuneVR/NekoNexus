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

import { ContactRequestStatus, ContactRequestView } from '@/Cmune/DataCenter/Common/Entities';
import DateTimeProxy from './DateTimeProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class ContactRequestViewProxy {
  static Serialize(stream: number[], instance: ContactRequestView): void {
    let num = 0;
    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.InitiatorCmid);

    if (instance.InitiatorMessage) {
      StringProxy.Serialize(memoryStream, instance.InitiatorMessage);
    } else {
      num |= 1;
    }

    if (instance.InitiatorName) {
      StringProxy.Serialize(memoryStream, instance.InitiatorName);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(memoryStream, instance.ReceiverCmid);
    Int32Proxy.Serialize(memoryStream, instance.RequestId);
    DateTimeProxy.Serialize(memoryStream, instance.SentDate);
    EnumProxy.Serialize<ContactRequestStatus>(memoryStream, instance.Status);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): ContactRequestView {
    const num = Int32Proxy.Deserialize(bytes);
    const contactRequestView = new ContactRequestView();
    contactRequestView.InitiatorCmid = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      contactRequestView.InitiatorMessage = StringProxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      contactRequestView.InitiatorName = StringProxy.Deserialize(bytes);
    }

    contactRequestView.ReceiverCmid = Int32Proxy.Deserialize(bytes);
    contactRequestView.RequestId = Int32Proxy.Deserialize(bytes);
    contactRequestView.SentDate = DateTimeProxy.Deserialize(bytes);
    contactRequestView.Status = EnumProxy.Deserialize<ContactRequestStatus>(bytes);

    return contactRequestView;
  }
}
