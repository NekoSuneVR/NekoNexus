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

import { GroupPosition, MemberPositionUpdateView } from '@/Cmune/DataCenter/Common/Entities';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class MemberPositionUpdateViewProxy {
  static Serialize(stream: number[], instance: MemberPositionUpdateView): void {
    let num = 0;

    const memoryStream: number[] = [];
    if (instance.AuthToken) {
      StringProxy.Serialize(memoryStream, instance.AuthToken);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.GroupId);
    Int32Proxy.Serialize(memoryStream, instance.MemberCmid);
    EnumProxy.Serialize<GroupPosition>(memoryStream, instance.Position);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): MemberPositionUpdateView {
    const num = Int32Proxy.Deserialize(bytes);
    const memberPositionUpdateView = new MemberPositionUpdateView();

    if ((num & 1) !== 0) {
      memberPositionUpdateView.AuthToken = StringProxy.Deserialize(bytes);
    }

    memberPositionUpdateView.GroupId = Int32Proxy.Deserialize(bytes);
    memberPositionUpdateView.MemberCmid = Int32Proxy.Deserialize(bytes);
    memberPositionUpdateView.Position = EnumProxy.Deserialize<GroupPosition>(bytes);

    return memberPositionUpdateView;
  }
}
