import { GameModeType } from '@/UberStrike/Core/Types';
import { MatchView, PlayerStatisticsView } from '@/UberStrike/DataCenter/Common/Entities';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import PlayerStatisticsViewProxy from './PlayerStatisticsViewProxy';

export default class MatchViewProxy {
  public static Serialize(stream: Stream, instance: MatchView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      EnumProxy.Serialize<GameModeType>(memoryStream, instance.GameModeId);
      Int32Proxy.Serialize(memoryStream, instance.MapId);
      if (instance.PlayersCompleted) {
        ListProxy.Serialize<PlayerStatisticsView>(memoryStream, instance.PlayersCompleted, PlayerStatisticsViewProxy.Serialize);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.PlayersLimit);
      if (instance.PlayersNonCompleted) {
        ListProxy.Serialize<PlayerStatisticsView>(memoryStream, instance.PlayersNonCompleted, PlayerStatisticsViewProxy.Serialize);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.TimeLimit);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): MatchView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let matchView: MatchView | null = null;
    if (num !== 0) {
      matchView = new MatchView();
      matchView.GameModeId = EnumProxy.Deserialize<GameModeType>(bytes);
      matchView.MapId = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        matchView.PlayersCompleted = ListProxy.Deserialize<PlayerStatisticsView>(bytes, PlayerStatisticsViewProxy.Deserialize);
      }
      matchView.PlayersLimit = Int32Proxy.Deserialize(bytes);
      if ((num & 2) !== 0) {
        matchView.PlayersNonCompleted = ListProxy.Deserialize<PlayerStatisticsView>(bytes, PlayerStatisticsViewProxy.Deserialize);
      }
      matchView.TimeLimit = Int32Proxy.Deserialize(bytes);
    }
    return matchView;
  }
}
