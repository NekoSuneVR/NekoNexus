import { PointDepositView, PointsDepositType } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import DateTimeProxy from './DateTimeProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';

export default class PointDepositViewProxy {
  public static Serialize(stream: Stream, instance: PointDepositView): void {
    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    DateTimeProxy.Serialize(memoryStream, instance.DepositDate);
    EnumProxy.Serialize<PointsDepositType>(memoryStream, instance.DepositType);
    BooleanProxy.Serialize(memoryStream, instance.IsAdminAction);
    Int32Proxy.Serialize(memoryStream, instance.PointDepositId);
    Int32Proxy.Serialize(memoryStream, instance.Points);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): PointDepositView {
    return new PointDepositView({
      Cmid: Int32Proxy.Deserialize(bytes),
      DepositDate: DateTimeProxy.Deserialize(bytes),
      DepositType: EnumProxy.Deserialize<PointsDepositType>(bytes),
      IsAdminAction: BooleanProxy.Deserialize(bytes),
      PointDepositId: Int32Proxy.Deserialize(bytes),
      Points: Int32Proxy.Deserialize(bytes),
    });
  }
}
