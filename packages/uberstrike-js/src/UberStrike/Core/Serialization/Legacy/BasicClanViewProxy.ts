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

import { BasicClanView, GroupColor, GroupFontStyle, GroupType } from '@/Cmune/DataCenter/Common/Entities';
import DateTimeProxy from '../DateTimeProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class BasicClanViewProxy {
  static Serialize(stream: number[], instance: BasicClanView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      if (instance.Address) {
        StringProxy.Serialize(memoryStream, instance.Address);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.ApplicationId);
      EnumProxy.Serialize<GroupColor>(memoryStream, instance.ColorStyle);
      if (instance.Description) {
        StringProxy.Serialize(memoryStream, instance.Description);
      } else {
        num |= 2;
      }
      EnumProxy.Serialize<GroupFontStyle>(memoryStream, instance.FontStyle);
      DateTimeProxy.Serialize(memoryStream, instance.FoundingDate);
      Int32Proxy.Serialize(memoryStream, instance.GroupId);
      DateTimeProxy.Serialize(memoryStream, instance.LastUpdated);
      Int32Proxy.Serialize(memoryStream, instance.MembersCount);
      Int32Proxy.Serialize(memoryStream, instance.MembersLimit);
      if (instance.Motto) {
        StringProxy.Serialize(memoryStream, instance.Motto);
      } else {
        num |= 4;
      }
      if (instance.Name) {
        StringProxy.Serialize(memoryStream, instance.Name);
      } else {
        num |= 8;
      }
      Int32Proxy.Serialize(memoryStream, instance.OwnerCmid);
      if (instance.OwnerName) {
        StringProxy.Serialize(memoryStream, instance.OwnerName);
      } else {
        num |= 16;
      }
      if (instance.Picture) {
        StringProxy.Serialize(memoryStream, instance.Picture);
      } else {
        num |= 32;
      }
      if (instance.Tag) {
        StringProxy.Serialize(memoryStream, instance.Tag);
      } else {
        num |= 64;
      }
      EnumProxy.Serialize<GroupType>(memoryStream, instance.Type);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): BasicClanView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let basicClanView: BasicClanView | null = null;
    if (num !== 0) {
      basicClanView = new BasicClanView();
      if ((num & 1) !== 0) {
        basicClanView.Address = StringProxy.Deserialize(bytes);
      }
      basicClanView.ApplicationId = Int32Proxy.Deserialize(bytes);
      basicClanView.ColorStyle = EnumProxy.Deserialize<GroupColor>(bytes);
      if ((num & 2) !== 0) {
        basicClanView.Description = StringProxy.Deserialize(bytes);
      }
      basicClanView.FontStyle = EnumProxy.Deserialize<GroupFontStyle>(bytes);
      basicClanView.FoundingDate = DateTimeProxy.Deserialize(bytes);
      basicClanView.GroupId = Int32Proxy.Deserialize(bytes);
      basicClanView.LastUpdated = DateTimeProxy.Deserialize(bytes);
      basicClanView.MembersCount = Int32Proxy.Deserialize(bytes);
      basicClanView.MembersLimit = Int32Proxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        basicClanView.Motto = StringProxy.Deserialize(bytes);
      }
      if ((num & 8) !== 0) {
        basicClanView.Name = StringProxy.Deserialize(bytes);
      }
      basicClanView.OwnerCmid = Int32Proxy.Deserialize(bytes);
      if ((num & 16) !== 0) {
        basicClanView.OwnerName = StringProxy.Deserialize(bytes);
      }
      if ((num & 32) !== 0) {
        basicClanView.Picture = StringProxy.Deserialize(bytes);
      }
      if ((num & 64) !== 0) {
        basicClanView.Tag = StringProxy.Deserialize(bytes);
      }
      basicClanView.Type = EnumProxy.Deserialize<GroupType>(bytes);
    }
    return basicClanView;
  }
}
