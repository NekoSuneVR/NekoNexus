import { MatchPointsView } from '@/UberStrike/Core/Models/Views';
import Int32Proxy from './Int32Proxy';

export default class MatchPointsViewProxy {
  public static Serialize(stream: Stream, instance: MatchPointsView) {
    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.LoserPointsBase);
    Int32Proxy.Serialize(memoryStream, instance.LoserPointsPerMinute);
    Int32Proxy.Serialize(memoryStream, instance.MaxTimeInGame);
    Int32Proxy.Serialize(memoryStream, instance.WinnerPointsBase);
    Int32Proxy.Serialize(memoryStream, instance.WinnerPointsPerMinute);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): MatchPointsView {
    return new MatchPointsView({
      LoserPointsBase: Int32Proxy.Deserialize(bytes),
      LoserPointsPerMinute: Int32Proxy.Deserialize(bytes),
      MaxTimeInGame: Int32Proxy.Deserialize(bytes),
      WinnerPointsBase: Int32Proxy.Deserialize(bytes),
      WinnerPointsPerMinute: Int32Proxy.Deserialize(bytes),
    });
  }
}
