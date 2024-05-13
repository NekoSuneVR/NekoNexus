import { StatsSummary, TeamID } from '@/UberStrike/Core/Models';
import ByteProxy from './ByteProxy';
import DictionaryProxy from './DictionaryProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';
import UInt16Proxy from './UInt16Proxy';

export default class StatsSummaryProxy {
  public static Serialize(stream: Stream, instance: StatsSummary): void {
    let num = 0;
    const memoryStream: MemoryStream = [];

    if (instance.Achievements) {
      DictionaryProxy.Serialize<byte, ushort>(
        memoryStream,
        instance.Achievements,
        ByteProxy.Serialize,
        UInt16Proxy.Serialize,
      );
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    Int32Proxy.Serialize(memoryStream, instance.Deaths);
    Int32Proxy.Serialize(memoryStream, instance.Kills);
    Int32Proxy.Serialize(memoryStream, instance.Level);

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 2;
    }

    EnumProxy.Serialize<TeamID>(memoryStream, instance.Team);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): StatsSummary {
    const num = Int32Proxy.Deserialize(bytes);
    const statsSummary = new StatsSummary();

    if ((num & 1) !== 0) {
      statsSummary.Achievements = DictionaryProxy.Deserialize<byte, ushort>(
        bytes,
        ByteProxy.Deserialize,
        UInt16Proxy.Deserialize,
      );
    }

    statsSummary.Cmid = Int32Proxy.Deserialize(bytes);
    statsSummary.Deaths = Int32Proxy.Deserialize(bytes);
    statsSummary.Kills = Int32Proxy.Deserialize(bytes);
    statsSummary.Level = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      statsSummary.Name = StringProxy.Deserialize(bytes);
    }

    statsSummary.Team = EnumProxy.Deserialize<TeamID>(bytes);

    return statsSummary;
  }
}
