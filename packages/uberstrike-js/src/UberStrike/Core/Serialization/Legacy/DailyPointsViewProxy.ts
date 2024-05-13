import { DailyPointsView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';

export default class DailyPointsViewProxy {
  public static Serialize(stream: Stream, instance: DailyPointsView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.Current);
      Int32Proxy.Serialize(memoryStream, instance.PointsMax);
      Int32Proxy.Serialize(memoryStream, instance.PointsTomorrow);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): DailyPointsView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let dailyPointsView: DailyPointsView | null = null;
    if (num !== 0) {
      dailyPointsView = new DailyPointsView();
      dailyPointsView.Current = Int32Proxy.Deserialize(bytes);
      dailyPointsView.PointsMax = Int32Proxy.Deserialize(bytes);
      dailyPointsView.PointsTomorrow = Int32Proxy.Deserialize(bytes);
    }
    return dailyPointsView;
  }
}
