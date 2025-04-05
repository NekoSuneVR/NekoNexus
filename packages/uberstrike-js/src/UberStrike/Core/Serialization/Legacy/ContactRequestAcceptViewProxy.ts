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

import { ContactRequestAcceptView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';
import PublicProfileViewProxy from './PublicProfileViewProxy';

export default class ContactRequestAcceptViewProxy {
  static Serialize(stream: number[], instance: ContactRequestAcceptView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.ActionResult);
      if (instance.Contact) {
        PublicProfileViewProxy.Serialize(memoryStream, instance.Contact);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.RequestId);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
      return;
    }
    Int32Proxy.Serialize(stream, 0);
  }

  static Deserialize(bytes: number[]): ContactRequestAcceptView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let contactRequestAcceptView: ContactRequestAcceptView | null = null;
    if (num !== 0) {
      contactRequestAcceptView = new ContactRequestAcceptView();
      contactRequestAcceptView.ActionResult = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        contactRequestAcceptView.Contact = PublicProfileViewProxy.Deserialize(bytes);
      }
      contactRequestAcceptView.RequestId = Int32Proxy.Deserialize(bytes);
    }
    return contactRequestAcceptView;
  }
}
