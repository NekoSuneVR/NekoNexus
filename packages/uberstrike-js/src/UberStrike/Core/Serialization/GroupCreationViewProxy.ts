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

import { GroupCreationView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class GroupCreationViewProxy {
  static Serialize(stream: number[], instance: GroupCreationView): void {
    let num = 0;
    const memoryStream: number[] = [];
    if (instance.Address) {
      StringProxy.Serialize(memoryStream, instance.Address);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.ApplicationId);

    if (instance.AuthToken) {
      StringProxy.Serialize(memoryStream, instance.AuthToken);
    } else {
      num |= 2;
    }

    if (instance.Description) {
      StringProxy.Serialize(memoryStream, instance.Description);
    } else {
      num |= 4;
    }

    BooleanProxy.Serialize(memoryStream, instance.HasPicture);

    if (instance.Locale) {
      StringProxy.Serialize(memoryStream, instance.Locale);
    } else {
      num |= 8;
    }

    if (instance.Motto) {
      StringProxy.Serialize(memoryStream, instance.Motto);
    } else {
      num |= 16;
    }

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 32;
    }

    if (instance.Tag) {
      StringProxy.Serialize(memoryStream, instance.Tag);
    } else {
      num |= 64;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): GroupCreationView {
    const num = Int32Proxy.Deserialize(bytes);
    const groupCreationView = new GroupCreationView();

    if ((num & 1) !== 0) {
      groupCreationView.Address = StringProxy.Deserialize(bytes);
    }

    groupCreationView.ApplicationId = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      groupCreationView.AuthToken = StringProxy.Deserialize(bytes);
    }

    if ((num & 4) !== 0) {
      groupCreationView.Description = StringProxy.Deserialize(bytes);
    }

    groupCreationView.HasPicture = BooleanProxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      groupCreationView.Locale = StringProxy.Deserialize(bytes);
    }

    if ((num & 16) !== 0) {
      groupCreationView.Motto = StringProxy.Deserialize(bytes);
    }

    if ((num & 32) !== 0) {
      groupCreationView.Name = StringProxy.Deserialize(bytes);
    }

    if ((num & 64) !== 0) {
      groupCreationView.Tag = StringProxy.Deserialize(bytes);
    }

    return groupCreationView;
  }
}
