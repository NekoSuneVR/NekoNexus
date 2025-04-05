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

import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import { CommActorInfo } from '@/UberStrike/Core/Models';
import ByteProxy from './ByteProxy';
import EnumProxy from './EnumProxy';
import GameRoomProxy from './GameRoomProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class CommActorInfoProxy {
  static Serialize(stream: number[], instance: CommActorInfo): void {
    let num = 0;
    const memoryStream: number[] = [];
    EnumProxy.Serialize<MemberAccessLevel>(memoryStream, instance.AccessLevel);
    EnumProxy.Serialize<ChannelType>(memoryStream, instance.Channel);

    if (instance.ClanTag) {
      StringProxy.Serialize(memoryStream, instance.ClanTag);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.Cmid);

    if (instance.CurrentRoom) {
      GameRoomProxy.Serialize(memoryStream, instance.CurrentRoom);
    } else {
      num |= 2;
    }

    ByteProxy.Serialize(memoryStream, instance.ModerationFlag);

    if (instance.ModInformation) {
      StringProxy.Serialize(memoryStream, instance.ModInformation);
    } else {
      num |= 4;
    }

    if (instance.PlayerName) {
      StringProxy.Serialize(memoryStream, instance.PlayerName);
    } else {
      num |= 8;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): CommActorInfo {
    const num = Int32Proxy.Deserialize(bytes);
    const commActorInfo = new CommActorInfo();
    commActorInfo.AccessLevel = EnumProxy.Deserialize<MemberAccessLevel>(bytes);
    commActorInfo.Channel = EnumProxy.Deserialize<ChannelType>(bytes);

    if ((num & 1) !== 0) {
      commActorInfo.ClanTag = StringProxy.Deserialize(bytes);
    }

    commActorInfo.Cmid = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      commActorInfo.CurrentRoom = GameRoomProxy.Deserialize(bytes);
    }

    commActorInfo.ModerationFlag = ByteProxy.Deserialize(bytes);

    if ((num & 4) !== 0) {
      commActorInfo.ModInformation = StringProxy.Deserialize(bytes);
    }

    if ((num & 8) !== 0) {
      commActorInfo.PlayerName = StringProxy.Deserialize(bytes);
    }

    return commActorInfo;
  }
}
