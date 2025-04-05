import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import { FireMode, GameActorInfoDelta, PlayerStates, SurfaceType, TeamID } from '@/UberStrike/Core/Models';
import ByteProxy from './ByteProxy';
import ColorProxy from './ColorProxy';
import EnumProxy from './EnumProxy';
import Int16Proxy from './Int16Proxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';
import UInt16Proxy from './UInt16Proxy';

export default class GameActorInfoDeltaProxy {
  static Serialize(stream: number[], instance: GameActorInfoDelta): void {
    if (instance) {
      Int32Proxy.Serialize(stream, instance.DeltaMask);
      ByteProxy.Serialize(stream, instance.Id);

      if ((instance.DeltaMask & 1) !== 0) {
        EnumProxy.Serialize<MemberAccessLevel>(
          stream,
          instance.Changes[GameActorInfoDelta.Keys.AccessLevel] as MemberAccessLevel,
        );
      }

      if ((instance.DeltaMask & 2) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.ArmorPointCapacity] as number);
      }

      if ((instance.DeltaMask & 4) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.ArmorPoints] as number);
      }

      if ((instance.DeltaMask & 8) !== 0) {
        EnumProxy.Serialize<ChannelType>(stream, instance.Changes[GameActorInfoDelta.Keys.Channel] as ChannelType);
      }

      if ((instance.DeltaMask & 16) !== 0) {
        StringProxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.ClanTag] as string);
      }

      if ((instance.DeltaMask & 32) !== 0) {
        Int32Proxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.Cmid] as number);
      }

      if ((instance.DeltaMask & 64) !== 0) {
        EnumProxy.Serialize<FireMode>(stream, instance.Changes[GameActorInfoDelta.Keys.CurrentFiringMode] as FireMode);
      }

      if ((instance.DeltaMask & 128) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.CurrentWeaponSlot] as number);
      }

      if ((instance.DeltaMask & 256) !== 0) {
        Int16Proxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.Deaths] as number);
      }

      if ((instance.DeltaMask & 512) !== 0) {
        ListProxy.Serialize<number>(
          stream,
          instance.Changes[GameActorInfoDelta.Keys.FunctionalItems] as number[],
          Int32Proxy.Serialize,
        );
      }

      if ((instance.DeltaMask & 1024) !== 0) {
        ListProxy.Serialize<number>(
          stream,
          instance.Changes[GameActorInfoDelta.Keys.Gear] as number[],
          Int32Proxy.Serialize,
        );
      }

      if ((instance.DeltaMask & 2048) !== 0) {
        Int16Proxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.Health] as number);
      }

      if ((instance.DeltaMask & 4096) !== 0) {
        Int16Proxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.Kills] as number);
      }

      if ((instance.DeltaMask & 8192) !== 0) {
        Int32Proxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.Level] as number);
      }

      if ((instance.DeltaMask & 16384) !== 0) {
        UInt16Proxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.Ping] as number);
      }

      if ((instance.DeltaMask & 32768) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.PlayerId] as number);
      }

      if ((instance.DeltaMask & 65536) !== 0) {
        StringProxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.PlayerName] as string);
      }

      if ((instance.DeltaMask & 131072) !== 0) {
        EnumProxy.Serialize<PlayerStates>(
          stream,
          instance.Changes[GameActorInfoDelta.Keys.PlayerState] as PlayerStates,
        );
      }

      if ((instance.DeltaMask & 262144) !== 0) {
        ListProxy.Serialize(
          stream,
          instance.Changes[GameActorInfoDelta.Keys.QuickItems] as number[],
          Int32Proxy.Serialize,
        );
      }

      if ((instance.DeltaMask & 524288) !== 0) {
        ByteProxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.Rank] as number);
      }

      if ((instance.DeltaMask & 1048576) !== 0) {
        ColorProxy.Serialize(stream, instance.Changes[GameActorInfoDelta.Keys.SkinColor]);
      }

      if ((instance.DeltaMask & 2097152) !== 0) {
        EnumProxy.Serialize<SurfaceType>(stream, instance.Changes[GameActorInfoDelta.Keys.StepSound] as SurfaceType);
      }

      if ((instance.DeltaMask & 4194304) !== 0) {
        EnumProxy.Serialize<TeamID>(stream, instance.Changes[GameActorInfoDelta.Keys.TeamID] as TeamID);
      }

      if ((instance.DeltaMask & 8388608) !== 0) {
        ListProxy.Serialize(
          stream,
          instance.Changes[GameActorInfoDelta.Keys.Weapons] as number[],
          Int32Proxy.Serialize,
        );
      }
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): GameActorInfoDelta {
    const num = Int32Proxy.Deserialize(bytes);
    const b = ByteProxy.Deserialize(bytes);
    const gameActorInfoDelta = new GameActorInfoDelta();
    gameActorInfoDelta.Id = b;

    if (num !== 0) {
      if ((num & 1) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.AccessLevel] =
          EnumProxy.Deserialize<MemberAccessLevel>(bytes);
      }

      if ((num & 2) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.ArmorPointCapacity] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 4) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.ArmorPoints] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 8) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.Channel] = EnumProxy.Deserialize<ChannelType>(bytes);
      }

      if ((num & 16) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.ClanTag] = StringProxy.Deserialize(bytes);
      }

      if ((num & 32) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.Cmid] = Int32Proxy.Deserialize(bytes);
      }

      if ((num & 64) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.CurrentFiringMode] = EnumProxy.Deserialize<FireMode>(bytes);
      }

      if ((num & 128) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.CurrentWeaponSlot] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 256) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.Deaths] = Int16Proxy.Deserialize(bytes);
      }

      if ((num & 512) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.FunctionalItems] = ListProxy.Deserialize<number>(
          bytes,
          Int32Proxy.Deserialize,
        );
      }

      if ((num & 1024) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.Gear] = ListProxy.Deserialize<number>(
          bytes,
          Int32Proxy.Deserialize,
        );
      }

      if ((num & 2048) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.Health] = Int16Proxy.Deserialize(bytes);
      }

      if ((num & 4096) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.Kills] = Int16Proxy.Deserialize(bytes);
      }

      if ((num & 8192) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.Level] = Int32Proxy.Deserialize(bytes);
      }

      if ((num & 16384) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.Ping] = UInt16Proxy.Deserialize(bytes);
      }

      if ((num & 32768) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.PlayerId] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 65536) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.PlayerName] = StringProxy.Deserialize(bytes);
      }

      if ((num & 131072) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.PlayerState] = EnumProxy.Deserialize<PlayerStates>(bytes);
      }

      if ((num & 262144) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.QuickItems] = ListProxy.Deserialize<number>(
          bytes,
          Int32Proxy.Deserialize,
        );
      }

      if ((num & 524288) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.Rank] = ByteProxy.Deserialize(bytes);
      }

      if ((num & 1048576) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.SkinColor] = ColorProxy.Deserialize(bytes);
      }

      if ((num & 2097152) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.StepSound] = EnumProxy.Deserialize<SurfaceType>(bytes);
      }

      if ((num & 4194304) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.TeamID] = EnumProxy.Deserialize<TeamID>(bytes);
      }

      if ((num & 8388608) !== 0) {
        gameActorInfoDelta.Changes[GameActorInfoDelta.Keys.Weapons] = ListProxy.Deserialize<number>(
          bytes,
          Int32Proxy.Deserialize,
        );
      }
    }

    return gameActorInfoDelta;
  }
}
