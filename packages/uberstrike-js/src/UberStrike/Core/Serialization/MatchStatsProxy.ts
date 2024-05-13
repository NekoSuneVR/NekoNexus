import { GameModeType } from '@/UberStrike/Core/Types';
import { MatchStats, PlayerMatchStats } from '@/UberStrike/DataCenter/Common/Entities';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import PlayerMatchStatsProxy from './PlayerMatchStatsProxy';

export default class MatchStatsProxy {
  public static Serialize(stream: Stream, instance: MatchStats): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    EnumProxy.Serialize<GameModeType>(memoryStream, instance.GameModeId);
    Int32Proxy.Serialize(memoryStream, instance.MapId);

    if (instance.Players) {
      ListProxy.Serialize<PlayerMatchStats>(memoryStream, instance.Players, PlayerMatchStatsProxy.Serialize);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.PlayersLimit);
    Int32Proxy.Serialize(memoryStream, instance.TimeLimit);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): MatchStats {
    const num = Int32Proxy.Deserialize(bytes);
    const matchStats = new MatchStats();
    matchStats.GameModeId = EnumProxy.Deserialize<GameModeType>(bytes);
    matchStats.MapId = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      matchStats.Players = ListProxy.Deserialize<PlayerMatchStats>(bytes, PlayerMatchStatsProxy.Deserialize);
    }

    matchStats.PlayersLimit = Int32Proxy.Deserialize(bytes);
    matchStats.TimeLimit = Int32Proxy.Deserialize(bytes);

    return matchStats;
  }
}
