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

import { ClanMemberView, GroupPosition } from '@/Cmune/DataCenter/Common/Entities';
import DateTimeProxy from '../DateTimeProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class ClanMemberViewProxy {
  static Serialize(stream: number[], instance: ClanMemberView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      DateTimeProxy.Serialize(memoryStream, instance.JoiningDate);
      DateTimeProxy.Serialize(memoryStream, instance.Lastlogin);
      if (instance.Name) {
        StringProxy.Serialize(memoryStream, instance.Name);
      } else {
        num |= 1;
      }
      EnumProxy.Serialize<GroupPosition>(memoryStream, instance.Position);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): ClanMemberView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let clanMemberView: ClanMemberView | null = null;
    if (num !== 0) {
      clanMemberView = new ClanMemberView();
      clanMemberView.Cmid = Int32Proxy.Deserialize(bytes);
      clanMemberView.JoiningDate = DateTimeProxy.Deserialize(bytes);
      clanMemberView.Lastlogin = DateTimeProxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        clanMemberView.Name = StringProxy.Deserialize(bytes);
      }
      clanMemberView.Position = EnumProxy.Deserialize<GroupPosition>(bytes);
    }
    return clanMemberView;
  }
}
