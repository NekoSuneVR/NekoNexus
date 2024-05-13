import { PlayerCardView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from './Int32Proxy';
import Int64Proxy from './Int64Proxy';
import StringProxy from './StringProxy';

export default class PlayerCardViewProxy {
  public static Serialize(stream: Stream, instance: PlayerCardView): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    Int64Proxy.Serialize(memoryStream, instance.Hits);

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 1;
    }

    if (instance.Precision) {
      StringProxy.Serialize(memoryStream, instance.Precision);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(memoryStream, instance.Ranking);
    Int64Proxy.Serialize(memoryStream, instance.Shots);
    Int32Proxy.Serialize(memoryStream, instance.Splats);
    Int32Proxy.Serialize(memoryStream, instance.Splatted);

    if (instance.TagName) {
      StringProxy.Serialize(memoryStream, instance.TagName);
    } else {
      num |= 4;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): PlayerCardView {
    const num = Int32Proxy.Deserialize(bytes);
    const playerCardView = new PlayerCardView();
    playerCardView.Cmid = Int32Proxy.Deserialize(bytes);
    playerCardView.Hits = Int64Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      playerCardView.Name = StringProxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      playerCardView.Precision = StringProxy.Deserialize(bytes);
    }

    playerCardView.Ranking = Int32Proxy.Deserialize(bytes);
    playerCardView.Shots = Int64Proxy.Deserialize(bytes);
    playerCardView.Splats = Int32Proxy.Deserialize(bytes);
    playerCardView.Splatted = Int32Proxy.Deserialize(bytes);

    if ((num & 4) !== 0) {
      playerCardView.TagName = StringProxy.Deserialize(bytes);
    }

    return playerCardView;
  }
}
