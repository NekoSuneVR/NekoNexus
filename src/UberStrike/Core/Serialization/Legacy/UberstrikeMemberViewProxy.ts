import { UberstrikeMemberView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';
import PlayerCardViewProxy from './PlayerCardViewProxy';
import PlayerStatisticsViewProxy from './PlayerStatisticsViewProxy';

export default class UberstrikeMemberViewProxy {
  public static Serialize(stream: Stream, instance: UberstrikeMemberView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.PlayerCardView) {
        PlayerCardViewProxy.Serialize(memoryStream, instance.PlayerCardView);
      } else {
        num |= 1;
      }
      if (instance.PlayerStatisticsView) {
        PlayerStatisticsViewProxy.Serialize(memoryStream, instance.PlayerStatisticsView);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): UberstrikeMemberView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let uberstrikeMemberView: UberstrikeMemberView | null = null;
    if (num !== 0) {
      uberstrikeMemberView = new UberstrikeMemberView();
      if ((num & 1) !== 0) {
        uberstrikeMemberView.PlayerCardView = (PlayerCardViewProxy.Deserialize(bytes))!;
      }
      if ((num & 2) !== 0) {
        uberstrikeMemberView.PlayerStatisticsView = (PlayerStatisticsViewProxy.Deserialize(bytes))!;
      }
    }
    return uberstrikeMemberView;
  }
}
