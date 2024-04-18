import { ContactRequestStatus, ContactRequestView } from '@/Cmune/DataCenter/Common/Entities';
import DateTimeProxy from './DateTimeProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class ContactRequestViewProxy {
  public static Serialize(stream: Stream, instance: ContactRequestView): void {
    let num = 0;
    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.InitiatorCmid);

    if (instance.InitiatorMessage) {
      StringProxy.Serialize(memoryStream, instance.InitiatorMessage);
    } else {
      num |= 1;
    }

    if (instance.InitiatorName) {
      StringProxy.Serialize(memoryStream, instance.InitiatorName);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(memoryStream, instance.ReceiverCmid);
    Int32Proxy.Serialize(memoryStream, instance.RequestId);
    DateTimeProxy.Serialize(memoryStream, instance.SentDate);
    EnumProxy.Serialize<ContactRequestStatus>(memoryStream, instance.Status);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ContactRequestView {
    const num = Int32Proxy.Deserialize(bytes);
    const contactRequestView = new ContactRequestView();
    contactRequestView.InitiatorCmid = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      contactRequestView.InitiatorMessage = StringProxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      contactRequestView.InitiatorName = StringProxy.Deserialize(bytes);
    }

    contactRequestView.ReceiverCmid = Int32Proxy.Deserialize(bytes);
    contactRequestView.RequestId = Int32Proxy.Deserialize(bytes);
    contactRequestView.SentDate = DateTimeProxy.Deserialize(bytes);
    contactRequestView.Status = EnumProxy.Deserialize<ContactRequestStatus>(bytes);

    return contactRequestView;
  }
}
