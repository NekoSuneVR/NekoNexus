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

import { GroupInvitationView } from '@/Cmune/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class GroupInvitationViewProxy {
  static Serialize(stream: number[], instance: GroupInvitationView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.GroupId);
      Int32Proxy.Serialize(memoryStream, instance.GroupInvitationId);
      if (instance.GroupName) {
        StringProxy.Serialize(memoryStream, instance.GroupName);
      } else {
        num |= 1;
      }
      if (instance.GroupTag) {
        StringProxy.Serialize(memoryStream, instance.GroupTag);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.InviteeCmid);
      if (instance.InviteeName) {
        StringProxy.Serialize(memoryStream, instance.InviteeName);
      } else {
        num |= 4;
      }
      Int32Proxy.Serialize(memoryStream, instance.InviterCmid);
      if (instance.InviterName) {
        StringProxy.Serialize(memoryStream, instance.InviterName);
      } else {
        num |= 8;
      }
      if (instance.Message) {
        StringProxy.Serialize(memoryStream, instance.Message);
      } else {
        num |= 16;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): GroupInvitationView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let groupInvitationView: GroupInvitationView | null = null;
    if (num !== 0) {
      groupInvitationView = new GroupInvitationView();
      groupInvitationView.GroupId = Int32Proxy.Deserialize(bytes);
      groupInvitationView.GroupInvitationId = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        groupInvitationView.GroupName = StringProxy.Deserialize(bytes);
      }
      if ((num & 2) !== 0) {
        groupInvitationView.GroupTag = StringProxy.Deserialize(bytes);
      }
      groupInvitationView.InviteeCmid = Int32Proxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        groupInvitationView.InviteeName = StringProxy.Deserialize(bytes);
      }
      groupInvitationView.InviterCmid = Int32Proxy.Deserialize(bytes);
      if ((num & 8) !== 0) {
        groupInvitationView.InviterName = StringProxy.Deserialize(bytes);
      }
      if ((num & 16) !== 0) {
        groupInvitationView.Message = StringProxy.Deserialize(bytes);
      }
    }
    return groupInvitationView;
  }
}
