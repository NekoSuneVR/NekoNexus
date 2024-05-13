import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import { CommActorInfo } from '@/UberStrike/Core/Models';
import ByteProxy from './ByteProxy';
import EnumProxy from './EnumProxy';
import GameRoomProxy from './GameRoomProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class CommActorInfoProxy {
  public static Serialize(stream: Stream, instance: CommActorInfo): void {
    let num = 0;
    const memoryStream: MemoryStream = [];
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
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): CommActorInfo {
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
