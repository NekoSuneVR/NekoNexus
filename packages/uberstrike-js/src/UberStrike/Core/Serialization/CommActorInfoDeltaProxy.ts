import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import { CommActorInfoDelta, GameRoom } from '@/UberStrike/Core/Models';
import { Keys } from '../Models/CommActorInfoDelta';
import ByteProxy from './ByteProxy';
import EnumProxy from './EnumProxy';
import GameRoomProxy from './GameRoomProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class CommActorInfoDeltaProxy {
  public static Serialize(stream: Stream, instance: CommActorInfoDelta): void {
    if (instance) {
      Int32Proxy.Serialize(stream, instance.DeltaMask);
      ByteProxy.Serialize(stream, instance.Id);

      if ((instance.DeltaMask & 1) !== 0) {
        EnumProxy.Serialize<MemberAccessLevel>(stream, instance.Changes[Keys.AccessLevel] as MemberAccessLevel);
      }

      if ((instance.DeltaMask & 2) !== 0) {
        EnumProxy.Serialize<ChannelType>(stream, instance.Changes[Keys.Channel] as ChannelType);
      }

      if ((instance.DeltaMask & 4) !== 0) {
        StringProxy.Serialize(stream, instance.Changes[Keys.ClanTag] as string);
      }

      if ((instance.DeltaMask & 8) !== 0) {
        Int32Proxy.Serialize(stream, instance.Changes[Keys.Cmid] as number);
      }

      if ((instance.DeltaMask & 16) !== 0) {
        GameRoomProxy.Serialize(stream, instance.Changes[Keys.CurrentRoom] as GameRoom);
      }

      if ((instance.DeltaMask & 32) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[Keys.ModerationFlag] as number);
      }

      if ((instance.DeltaMask & 64) !== 0) {
        StringProxy.Serialize(stream, instance.Changes[Keys.ModInformation] as string);
      }

      if ((instance.DeltaMask & 128) !== 0) {
        StringProxy.Serialize(stream, instance.Changes[Keys.PlayerName] as string);
      }
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): CommActorInfoDelta {
    const num = Int32Proxy.Deserialize(bytes);
    const b = ByteProxy.Deserialize(bytes);
    const commActorInfoDelta = new CommActorInfoDelta();
    commActorInfoDelta.Id = b;

    if (num !== 0) {
      if ((num & 1) !== 0) {
        commActorInfoDelta.Changes[Keys.AccessLevel] = EnumProxy.Deserialize<MemberAccessLevel>(bytes);
      }

      if ((num & 2) !== 0) {
        commActorInfoDelta.Changes[Keys.Channel] = EnumProxy.Deserialize<ChannelType>(bytes);
      }

      if ((num & 4) !== 0) {
        commActorInfoDelta.Changes[Keys.ClanTag] = StringProxy.Deserialize(bytes);
      }

      if ((num & 8) !== 0) {
        commActorInfoDelta.Changes[Keys.Cmid] = Int32Proxy.Deserialize(bytes);
      }

      if ((num & 16) !== 0) {
        commActorInfoDelta.Changes[Keys.CurrentRoom] = GameRoomProxy.Deserialize(bytes);
      }

      if ((num & 32) !== 0) {
        commActorInfoDelta.Changes[Keys.ModerationFlag] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 64) !== 0) {
        commActorInfoDelta.Changes[Keys.ModInformation] = StringProxy.Deserialize(bytes);
      }

      if ((num & 128) !== 0) {
        commActorInfoDelta.Changes[Keys.PlayerName] = StringProxy.Deserialize(bytes);
      }
    }

    return commActorInfoDelta;
  }
}
