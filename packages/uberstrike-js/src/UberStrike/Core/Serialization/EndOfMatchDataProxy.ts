import { EndOfMatchData, StatsSummary } from '@/UberStrike/Core/Models';
import BooleanProxy from './BooleanProxy';
import ByteProxy from './ByteProxy';
import DictionaryProxy from './DictionaryProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import StatsCollectionProxy from './StatsCollectionProxy';
import StatsSummaryProxy from './StatsSummaryProxy';
import StringProxy from './StringProxy';
import UInt16Proxy from './UInt16Proxy';

export default class EndOfMatchDataProxy {
  public static Serialize(stream: Stream, instance: EndOfMatchData): void {
    let num = 0;
    const memoryStream: MemoryStream = [];

    BooleanProxy.Serialize(memoryStream, instance.HasWonMatch);

    if (instance.MatchGuid) {
      StringProxy.Serialize(memoryStream, instance.MatchGuid);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.MostEffecientWeaponId);

    if (instance.MostValuablePlayers) {
      ListProxy.Serialize<StatsSummary>(memoryStream, instance.MostValuablePlayers, StatsSummaryProxy.Serialize);
    } else {
      num |= 2;
    }

    if (instance.PlayerStatsBestPerLife) {
      StatsCollectionProxy.Serialize(memoryStream, instance.PlayerStatsBestPerLife);
    } else {
      num |= 4;
    }

    if (instance.PlayerStatsTotal) {
      StatsCollectionProxy.Serialize(memoryStream, instance.PlayerStatsTotal);
    } else {
      num |= 8;
    }

    if (instance.PlayerXpEarned) {
      DictionaryProxy.Serialize<byte, ushort>(
        memoryStream,
        instance.PlayerXpEarned,
        ByteProxy.Serialize,
        UInt16Proxy.Serialize,
      );
    } else {
      num |= 16;
    }

    Int32Proxy.Serialize(memoryStream, instance.TimeInGameMinutes);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): EndOfMatchData {
    const num = Int32Proxy.Deserialize(bytes);
    const endOfMatchData = new EndOfMatchData();
    endOfMatchData.HasWonMatch = BooleanProxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      endOfMatchData.MatchGuid = StringProxy.Deserialize(bytes);
    }

    endOfMatchData.MostEffecientWeaponId = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      endOfMatchData.MostValuablePlayers = ListProxy.Deserialize<StatsSummary>(bytes, StatsSummaryProxy.Deserialize);
    }

    if ((num & 4) !== 0) {
      endOfMatchData.PlayerStatsBestPerLife = StatsCollectionProxy.Deserialize(bytes);
    }

    if ((num & 8) !== 0) {
      endOfMatchData.PlayerStatsTotal = StatsCollectionProxy.Deserialize(bytes);
    }

    if ((num & 16) !== 0) {
      endOfMatchData.PlayerXpEarned = DictionaryProxy.Deserialize<byte, ushort>(
        bytes,
        ByteProxy.Deserialize,
        UInt16Proxy.Deserialize,
      );
    }

    endOfMatchData.TimeInGameMinutes = Int32Proxy.Deserialize(bytes);

    return endOfMatchData;
  }
}
