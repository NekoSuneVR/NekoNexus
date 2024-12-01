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

import { EmailAddressStatus, MemberAccessLevel, PublicProfileView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import DateTimeProxy from './DateTimeProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class PublicProfileViewProxy {
  static Serialize(stream: number[], instance: PublicProfileView) {
    let num = 0;
    const memoryStream: number[] = [];
    EnumProxy.Serialize<MemberAccessLevel>(memoryStream, instance.AccessLevel);
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    EnumProxy.Serialize<EmailAddressStatus>(memoryStream, instance.EmailAddressStatus);

    if (instance.FacebookId) {
      StringProxy.Serialize(memoryStream, instance.FacebookId);
    } else {
      num |= 1;
    }

    if (instance.GroupTag) {
      StringProxy.Serialize(memoryStream, instance.GroupTag);
    } else {
      num |= 2;
    }

    BooleanProxy.Serialize(memoryStream, instance.IsChatDisabled);
    DateTimeProxy.Serialize(memoryStream, instance.LastLoginDate);

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 4;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PublicProfileView {
    const num = Int32Proxy.Deserialize(bytes);
    const publicProfileView = new PublicProfileView();
    publicProfileView.AccessLevel = EnumProxy.Deserialize<MemberAccessLevel>(bytes);
    publicProfileView.Cmid = Int32Proxy.Deserialize(bytes);
    publicProfileView.EmailAddressStatus = EnumProxy.Deserialize<EmailAddressStatus>(bytes);

    if ((num & 1) !== 0) {
      publicProfileView.FacebookId = StringProxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      publicProfileView.GroupTag = StringProxy.Deserialize(bytes);
    }

    publicProfileView.IsChatDisabled = BooleanProxy.Deserialize(bytes);
    publicProfileView.LastLoginDate = DateTimeProxy.Deserialize(bytes);

    if ((num & 4) !== 0) {
      publicProfileView.Name = StringProxy.Deserialize(bytes);
    }

    return publicProfileView;
  }
}
