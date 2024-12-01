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

import { ContactGroupView, PublicProfileView } from '@/Cmune/DataCenter/Common/Entities';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import PublicProfileViewProxy from './PublicProfileViewProxy';
import StringProxy from './StringProxy';

export default class ContactGroupViewProxy {
  static Serialize(stream: number[], instance: ContactGroupView): void {
    let num = 0;
    const memoryStream: number[] = [];
    if (instance.Contacts) {
      ListProxy.Serialize<PublicProfileView>(memoryStream, instance.Contacts, PublicProfileViewProxy.Serialize);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.GroupId);

    if (instance.GroupName) {
      StringProxy.Serialize(memoryStream, instance.GroupName);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): ContactGroupView {
    const num = Int32Proxy.Deserialize(bytes);
    const contactGroupView = new ContactGroupView();

    if ((num & 1) !== 0) {
      contactGroupView.Contacts = ListProxy.Deserialize<PublicProfileView>(bytes, PublicProfileViewProxy.Deserialize);
    }

    contactGroupView.GroupId = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      contactGroupView.GroupName = StringProxy.Deserialize(bytes);
    }

    return contactGroupView;
  }
}
