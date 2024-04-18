import {
    ChannelType, MemberAccessLevel,
} from '@/Cmune/DataCenter/Common/Entities';
import {
    FireMode, GameActorInfo, PlayerStates, SurfaceType, TeamID,
} from '@/UberStrike/Core/Models';
import ByteProxy from './ByteProxy';
import ColorProxy from './ColorProxy';
import EnumProxy from './EnumProxy';
import Int16Proxy from './Int16Proxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';
import UInt16Proxy from './UInt16Proxy';

export default class GameActorInfoProxy {
  public static Serialize(stream: Stream, instance: GameActorInfo): void {
    let num = 0;
    const memoryStream: MemoryStream = [];

    EnumProxy.Serialize<MemberAccessLevel>(memoryStream, instance.AccessLevel);
    ByteProxy.Serialize(memoryStream, instance.ArmorPointCapacity);
    ByteProxy.Serialize(memoryStream, instance.ArmorPoints);
    EnumProxy.Serialize<ChannelType>(memoryStream, instance.Channel);

    if (instance.ClanTag) {
      StringProxy.Serialize(memoryStream, instance.ClanTag);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    EnumProxy.Serialize<FireMode>(memoryStream, instance.CurrentFiringMode);
    ByteProxy.Serialize(memoryStream, instance.CurrentWeaponSlot);
    Int16Proxy.Serialize(memoryStream, instance.Deaths);

    if (instance.FunctionalItems) {
      ListProxy.Serialize<int>(memoryStream, instance.FunctionalItems, Int32Proxy.Serialize);
    } else {
      num |= 2;
    }

    if (instance.Gear) {
      ListProxy.Serialize<int>(memoryStream, instance.Gear, Int32Proxy.Serialize);
    } else {
      num |= 4;
    }

    Int16Proxy.Serialize(memoryStream, instance.Health);
    Int16Proxy.Serialize(memoryStream, instance.Kills);
    Int32Proxy.Serialize(memoryStream, instance.Level);
    UInt16Proxy.Serialize(memoryStream, instance.Ping);
    ByteProxy.Serialize(memoryStream, instance.PlayerId);

    if (instance.PlayerName) {
      StringProxy.Serialize(memoryStream, instance.PlayerName);
    } else {
      num |= 8;
    }

    EnumProxy.Serialize<PlayerStates>(memoryStream, instance.PlayerState);

    if (instance.QuickItems) {
      ListProxy.Serialize<int>(memoryStream, instance.QuickItems, Int32Proxy.Serialize);
    } else {
      num |= 16;
    }

    ByteProxy.Serialize(memoryStream, instance.Rank);
    // Not trying to be racist here, that's what UberStrike wants ¯\_(ツ)_/¯
    ColorProxy.Serialize(memoryStream, { r: 255, g: 255, b: 255 });
    EnumProxy.Serialize<SurfaceType>(memoryStream, instance.StepSound);
    EnumProxy.Serialize<TeamID>(memoryStream, instance.TeamID);

    if (instance.Weapons) {
      ListProxy.Serialize<int>(memoryStream, instance.Weapons, Int32Proxy.Serialize);
    } else {
      num |= 32;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): GameActorInfo {
    const num = Int32Proxy.Deserialize(bytes);
    const gameActorInfo = new GameActorInfo();
    gameActorInfo.AccessLevel = EnumProxy.Deserialize<MemberAccessLevel>(bytes);
    gameActorInfo.ArmorPointCapacity = ByteProxy.Deserialize(bytes);
    gameActorInfo.ArmorPoints = ByteProxy.Deserialize(bytes);
    gameActorInfo.Channel = EnumProxy.Deserialize<ChannelType>(bytes);

    if ((num & 1) !== 0) {
      gameActorInfo.ClanTag = StringProxy.Deserialize(bytes);
    }

    gameActorInfo.Cmid = Int32Proxy.Deserialize(bytes);
    gameActorInfo.CurrentFiringMode = EnumProxy.Deserialize<FireMode>(bytes);
    gameActorInfo.CurrentWeaponSlot = ByteProxy.Deserialize(bytes);
    gameActorInfo.Deaths = Int16Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      gameActorInfo.FunctionalItems = ListProxy.Deserialize<int>(bytes, Int32Proxy.Deserialize);
    }

    if ((num & 4) !== 0) {
      gameActorInfo.Gear = ListProxy.Deserialize<int>(bytes, Int32Proxy.Deserialize);
    }

    gameActorInfo.Health = Int16Proxy.Deserialize(bytes);
    gameActorInfo.Kills = Int16Proxy.Deserialize(bytes);
    gameActorInfo.Level = Int32Proxy.Deserialize(bytes);
    gameActorInfo.Ping = UInt16Proxy.Deserialize(bytes);
    gameActorInfo.PlayerId = ByteProxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      gameActorInfo.PlayerName = StringProxy.Deserialize(bytes);
    }

    gameActorInfo.PlayerState = EnumProxy.Deserialize<PlayerStates>(bytes);

    if ((num & 16) !== 0) {
      gameActorInfo.QuickItems = ListProxy.Deserialize<int>(bytes, Int32Proxy.Deserialize);
    }

    gameActorInfo.Rank = ByteProxy.Deserialize(bytes);
    gameActorInfo.SkinColor = ColorProxy.Deserialize(bytes);
    gameActorInfo.StepSound = EnumProxy.Deserialize<SurfaceType>(bytes);
    gameActorInfo.TeamID = EnumProxy.Deserialize<TeamID>(bytes);

    if ((num & 32) !== 0) {
      gameActorInfo.Weapons = ListProxy.Deserialize<int>(bytes, Int32Proxy.Deserialize);
    }

    return gameActorInfo;
  }
}
