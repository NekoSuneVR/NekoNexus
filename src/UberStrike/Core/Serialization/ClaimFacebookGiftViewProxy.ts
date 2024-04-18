import { ClaimFacebookGiftResult, ClaimFacebookGiftView } from '@/Cmune/DataCenter/Common/Entities';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';

export default class ClaimFacebookGiftViewProxy {
  public static Serialize(stream: Stream, instance: ClaimFacebookGiftView): void {
    let num = 0;
    const memoryStream: MemoryStream = [];
    EnumProxy.Serialize<ClaimFacebookGiftResult>(memoryStream, instance.ClaimResult);

    if (!Number.isNaN(instance.ItemId!)) {
      const stream2 = memoryStream;
      const itemId = instance.ItemId;
      Int32Proxy.Serialize(stream2, (itemId == null) ? 0 : itemId);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ClaimFacebookGiftView {
    const num = Int32Proxy.Deserialize(bytes);
    const claimFacebookGiftView = new ClaimFacebookGiftView();
    claimFacebookGiftView.ClaimResult = EnumProxy.Deserialize<ClaimFacebookGiftResult>(bytes);

    if ((num & 1) !== 0) {
      claimFacebookGiftView.ItemId = Int32Proxy.Deserialize(bytes);
    }

    return claimFacebookGiftView;
  }
}
