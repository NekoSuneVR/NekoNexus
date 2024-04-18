import { MemberReportType, MemberReportView } from '@/Cmune/DataCenter/Common/Entities';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class MemberReportViewProxy {
  public static Serialize(stream: Stream, instance: MemberReportView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.ApplicationId);
      if (instance.Context) {
        StringProxy.Serialize(memoryStream, instance.Context);
      } else {
        num |= 1;
      }
      if (instance.IP) {
        StringProxy.Serialize(memoryStream, instance.IP);
      } else {
        num |= 2;
      }
      if (instance.Reason) {
        StringProxy.Serialize(memoryStream, instance.Reason);
      } else {
        num |= 4;
      }
      EnumProxy.Serialize<MemberReportType>(memoryStream, instance.ReportType);
      Int32Proxy.Serialize(memoryStream, instance.SourceCmid);
      Int32Proxy.Serialize(memoryStream, instance.TargetCmid);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): MemberReportView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let memberReportView: MemberReportView | null = null;
    if (num !== 0) {
      memberReportView = new MemberReportView();
      memberReportView.ApplicationId = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        memberReportView.Context = StringProxy.Deserialize(bytes);
      }
      if ((num & 2) !== 0) {
        memberReportView.IP = StringProxy.Deserialize(bytes);
      }
      if ((num & 4) !== 0) {
        memberReportView.Reason = StringProxy.Deserialize(bytes);
      }
      memberReportView.ReportType = EnumProxy.Deserialize<MemberReportType>(bytes);
      memberReportView.SourceCmid = Int32Proxy.Deserialize(bytes);
      memberReportView.TargetCmid = Int32Proxy.Deserialize(bytes);
    }
    return memberReportView;
  }
}
