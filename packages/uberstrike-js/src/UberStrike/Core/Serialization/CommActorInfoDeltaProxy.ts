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
import { CommActorInfoDelta, GameRoom } from '@/UberStrike/Core/Models';
import ByteProxy from './ByteProxy';
import EnumProxy from './EnumProxy';
import GameRoomProxy from './GameRoomProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class CommActorInfoDeltaProxy {
  static Serialize(stream: number[], instance: CommActorInfoDelta): void {
    if (instance) {
      Int32Proxy.Serialize(stream, instance.DeltaMask);
      ByteProxy.Serialize(stream, instance.Id);

      if ((instance.DeltaMask & 1) !== 0) {
        EnumProxy.Serialize<MemberAccessLevel>(
          stream,
          instance.Changes[CommActorInfoDelta.Keys.AccessLevel] as MemberAccessLevel,
        );
      }

      if ((instance.DeltaMask & 2) !== 0) {
        EnumProxy.Serialize<ChannelType>(stream, instance.Changes[CommActorInfoDelta.Keys.Channel] as ChannelType);
      }

      if ((instance.DeltaMask & 4) !== 0) {
        StringProxy.Serialize(stream, instance.Changes[CommActorInfoDelta.Keys.ClanTag] as string);
      }

      if ((instance.DeltaMask & 8) !== 0) {
        Int32Proxy.Serialize(stream, instance.Changes[CommActorInfoDelta.Keys.Cmid] as number);
      }

      if ((instance.DeltaMask & 16) !== 0) {
        GameRoomProxy.Serialize(stream, instance.Changes[CommActorInfoDelta.Keys.CurrentRoom] as GameRoom);
      }

      if ((instance.DeltaMask & 32) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[CommActorInfoDelta.Keys.ModerationFlag] as number);
      }

      if ((instance.DeltaMask & 64) !== 0) {
        StringProxy.Serialize(stream, instance.Changes[CommActorInfoDelta.Keys.ModInformation] as string);
      }

      if ((instance.DeltaMask & 128) !== 0) {
        StringProxy.Serialize(stream, instance.Changes[CommActorInfoDelta.Keys.PlayerName] as string);
      }
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): CommActorInfoDelta {
    const num = Int32Proxy.Deserialize(bytes);
    const b = ByteProxy.Deserialize(bytes);
    const commActorInfoDelta = new CommActorInfoDelta();
    commActorInfoDelta.Id = b;

    if (num !== 0) {
      if ((num & 1) !== 0) {
        commActorInfoDelta.Changes[CommActorInfoDelta.Keys.AccessLevel] =
          EnumProxy.Deserialize<MemberAccessLevel>(bytes);
      }

      if ((num & 2) !== 0) {
        commActorInfoDelta.Changes[CommActorInfoDelta.Keys.Channel] = EnumProxy.Deserialize<ChannelType>(bytes);
      }

      if ((num & 4) !== 0) {
        commActorInfoDelta.Changes[CommActorInfoDelta.Keys.ClanTag] = StringProxy.Deserialize(bytes);
      }

      if ((num & 8) !== 0) {
        commActorInfoDelta.Changes[CommActorInfoDelta.Keys.Cmid] = Int32Proxy.Deserialize(bytes);
      }

      if ((num & 16) !== 0) {
        commActorInfoDelta.Changes[CommActorInfoDelta.Keys.CurrentRoom] = GameRoomProxy.Deserialize(bytes);
      }

      if ((num & 32) !== 0) {
        commActorInfoDelta.Changes[CommActorInfoDelta.Keys.ModerationFlag] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 64) !== 0) {
        commActorInfoDelta.Changes[CommActorInfoDelta.Keys.ModInformation] = StringProxy.Deserialize(bytes);
      }

      if ((num & 128) !== 0) {
        commActorInfoDelta.Changes[CommActorInfoDelta.Keys.PlayerName] = StringProxy.Deserialize(bytes);
      }
    }

    return commActorInfoDelta;
  }
}
