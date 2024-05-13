import { PointDepositView, PointsDepositType } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from '../BooleanProxy';
import DateTimeProxy from '../DateTimeProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';

export default class PointDepositViewProxy {
  public static Serialize(stream: Stream, instance: PointDepositView): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      DateTimeProxy.Serialize(memoryStream, instance.DepositDate);
      EnumProxy.Serialize<PointsDepositType>(memoryStream, instance.DepositType);
      BooleanProxy.Serialize(memoryStream, instance.IsAdminAction);
      Int32Proxy.Serialize(memoryStream, instance.PointDepositId);
      Int32Proxy.Serialize(memoryStream, instance.Points);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): PointDepositView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let pointDepositView: PointDepositView | null = null;
    if (num !== 0) {
      pointDepositView = new PointDepositView();
      pointDepositView.Cmid = Int32Proxy.Deserialize(bytes);
      pointDepositView.DepositDate = DateTimeProxy.Deserialize(bytes);
      pointDepositView.DepositType = EnumProxy.Deserialize<PointsDepositType>(bytes);
      pointDepositView.IsAdminAction = BooleanProxy.Deserialize(bytes);
      pointDepositView.PointDepositId = Int32Proxy.Deserialize(bytes);
      pointDepositView.Points = Int32Proxy.Deserialize(bytes);
    }
    return pointDepositView;
  }
}
