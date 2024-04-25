import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import { FireMode, GameActorInfoDelta, PlayerStates, SurfaceType, TeamID } from '@/UberStrike/Core/Models';
import { Keys } from '@/UberStrike/Core/Models/GameActorInfoDelta';
import ByteProxy from './ByteProxy';
import ColorProxy from './ColorProxy';
import EnumProxy from './EnumProxy';
import Int16Proxy from './Int16Proxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';
import UInt16Proxy from './UInt16Proxy';

export default class GameActorInfoDeltaProxy {
  public static Serialize(stream: Stream, instance: GameActorInfoDelta): void {
    if (instance) {
      Int32Proxy.Serialize(stream, instance.DeltaMask);
      ByteProxy.Serialize(stream, instance.Id);

      if ((instance.DeltaMask & 1) !== 0) {
        EnumProxy.Serialize<MemberAccessLevel>(stream, instance.Changes[Keys.AccessLevel] as MemberAccessLevel);
      }

      if ((instance.DeltaMask & 2) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[Keys.ArmorPointCapacity] as byte);
      }

      if ((instance.DeltaMask & 4) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[Keys.ArmorPoints] as byte);
      }

      if ((instance.DeltaMask & 8) !== 0) {
        EnumProxy.Serialize<ChannelType>(stream, instance.Changes[Keys.Channel] as ChannelType);
      }

      if ((instance.DeltaMask & 16) !== 0) {
        StringProxy.Serialize(stream, instance.Changes[Keys.ClanTag] as string);
      }

      if ((instance.DeltaMask & 32) !== 0) {
        Int32Proxy.Serialize(stream, instance.Changes[Keys.Cmid] as int);
      }

      if ((instance.DeltaMask & 64) !== 0) {
        EnumProxy.Serialize<FireMode>(stream, instance.Changes[Keys.CurrentFiringMode] as FireMode);
      }

      if ((instance.DeltaMask & 128) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[Keys.CurrentWeaponSlot] as byte);
      }

      if ((instance.DeltaMask & 256) !== 0) {
        Int16Proxy.Serialize(stream, instance.Changes[Keys.Deaths] as short);
      }

      if ((instance.DeltaMask & 512) !== 0) {
        ListProxy.Serialize<number>(stream, instance.Changes[Keys.FunctionalItems] as int[], Int32Proxy.Serialize);
      }

      if ((instance.DeltaMask & 1024) !== 0) {
        ListProxy.Serialize<number>(stream, instance.Changes[Keys.Gear] as int[], Int32Proxy.Serialize);
      }

      if ((instance.DeltaMask & 2048) !== 0) {
        Int16Proxy.Serialize(stream, instance.Changes[Keys.Health] as short);
      }

      if ((instance.DeltaMask & 4096) !== 0) {
        Int16Proxy.Serialize(stream, instance.Changes[Keys.Kills] as short);
      }

      if ((instance.DeltaMask & 8192) !== 0) {
        Int32Proxy.Serialize(stream, instance.Changes[Keys.Level] as int);
      }

      if ((instance.DeltaMask & 16384) !== 0) {
        UInt16Proxy.Serialize(stream, instance.Changes[Keys.Ping] as ushort);
      }

      if ((instance.DeltaMask & 32768) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[Keys.PlayerId] as byte);
      }

      if ((instance.DeltaMask & 65536) !== 0) {
        StringProxy.Serialize(stream, instance.Changes[Keys.PlayerName] as string);
      }

      if ((instance.DeltaMask & 131072) !== 0) {
        EnumProxy.Serialize<PlayerStates>(stream, instance.Changes[Keys.PlayerState] as PlayerStates);
      }

      if ((instance.DeltaMask & 262144) !== 0) {
        ListProxy.Serialize(stream, instance.Changes[Keys.QuickItems] as int[], Int32Proxy.Serialize);
      }

      if ((instance.DeltaMask & 524288) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[Keys.Rank] as byte);
      }

      if ((instance.DeltaMask & 1048576) !== 0) {
        ColorProxy.Serialize(stream, instance.Changes[Keys.SkinColor]);
      }

      if ((instance.DeltaMask & 2097152) !== 0) {
        EnumProxy.Serialize<SurfaceType>(stream, instance.Changes[Keys.StepSound] as SurfaceType);
      }

      if ((instance.DeltaMask & 4194304) !== 0) {
        EnumProxy.Serialize<TeamID>(stream, instance.Changes[Keys.TeamID] as TeamID);
      }

      if ((instance.DeltaMask & 8388608) !== 0) {
        ListProxy.Serialize(stream, instance.Changes[Keys.Weapons] as int[], Int32Proxy.Serialize);
      }
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): GameActorInfoDelta {
    const num = Int32Proxy.Deserialize(bytes);
    const b = ByteProxy.Deserialize(bytes);
    const gameActorInfoDelta = new GameActorInfoDelta();
    gameActorInfoDelta.Id = b;

    if (num !== 0) {
      if ((num & 1) !== 0) {
        gameActorInfoDelta.Changes[Keys.AccessLevel] = EnumProxy.Deserialize<MemberAccessLevel>(bytes);
      }

      if ((num & 2) !== 0) {
        gameActorInfoDelta.Changes[Keys.ArmorPointCapacity] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 4) !== 0) {
        gameActorInfoDelta.Changes[Keys.ArmorPoints] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 8) !== 0) {
        gameActorInfoDelta.Changes[Keys.Channel] = EnumProxy.Deserialize<ChannelType>(bytes);
      }

      if ((num & 16) !== 0) {
        gameActorInfoDelta.Changes[Keys.ClanTag] = StringProxy.Deserialize(bytes);
      }

      if ((num & 32) !== 0) {
        gameActorInfoDelta.Changes[Keys.Cmid] = Int32Proxy.Deserialize(bytes);
      }

      if ((num & 64) !== 0) {
        gameActorInfoDelta.Changes[Keys.CurrentFiringMode] = EnumProxy.Deserialize<FireMode>(bytes);
      }

      if ((num & 128) !== 0) {
        gameActorInfoDelta.Changes[Keys.CurrentWeaponSlot] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 256) !== 0) {
        gameActorInfoDelta.Changes[Keys.Deaths] = Int16Proxy.Deserialize(bytes);
      }

      if ((num & 512) !== 0) {
        gameActorInfoDelta.Changes[Keys.FunctionalItems] = ListProxy.Deserialize<int>(bytes, Int32Proxy.Deserialize);
      }

      if ((num & 1024) !== 0) {
        gameActorInfoDelta.Changes[Keys.Gear] = ListProxy.Deserialize<int>(bytes, Int32Proxy.Deserialize);
      }

      if ((num & 2048) !== 0) {
        gameActorInfoDelta.Changes[Keys.Health] = Int16Proxy.Deserialize(bytes);
      }

      if ((num & 4096) !== 0) {
        gameActorInfoDelta.Changes[Keys.Kills] = Int16Proxy.Deserialize(bytes);
      }

      if ((num & 8192) !== 0) {
        gameActorInfoDelta.Changes[Keys.Level] = Int32Proxy.Deserialize(bytes);
      }

      if ((num & 16384) !== 0) {
        gameActorInfoDelta.Changes[Keys.Ping] = UInt16Proxy.Deserialize(bytes);
      }

      if ((num & 32768) !== 0) {
        gameActorInfoDelta.Changes[Keys.PlayerId] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 65536) !== 0) {
        gameActorInfoDelta.Changes[Keys.PlayerName] = StringProxy.Deserialize(bytes);
      }

      if ((num & 131072) !== 0) {
        gameActorInfoDelta.Changes[Keys.PlayerState] = EnumProxy.Deserialize<PlayerStates>(bytes);
      }

      if ((num & 262144) !== 0) {
        gameActorInfoDelta.Changes[Keys.QuickItems] = ListProxy.Deserialize<int>(bytes, Int32Proxy.Deserialize);
      }

      if ((num & 524288) !== 0) {
        gameActorInfoDelta.Changes[Keys.Rank] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 1048576) !== 0) {
        gameActorInfoDelta.Changes[Keys.SkinColor] = ColorProxy.Deserialize(bytes);
      }

      if ((num & 2097152) !== 0) {
        gameActorInfoDelta.Changes[Keys.StepSound] = EnumProxy.Deserialize<SurfaceType>(bytes);
      }

      if ((num & 4194304) !== 0) {
        gameActorInfoDelta.Changes[Keys.TeamID] = EnumProxy.Deserialize<TeamID>(bytes);
      }

      if ((num & 8388608) !== 0) {
        gameActorInfoDelta.Changes[Keys.Weapons] = ListProxy.Deserialize<int>(bytes, Int32Proxy.Deserialize);
      }
    }

    return gameActorInfoDelta;
  }
}
