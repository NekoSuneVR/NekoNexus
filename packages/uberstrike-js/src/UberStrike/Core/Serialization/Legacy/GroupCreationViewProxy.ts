import { GroupCreationView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from '../BooleanProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class GroupCreationViewProxy {
  public static Serialize(stream: Stream, instance: GroupCreationView): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.Address) {
        StringProxy.Serialize(memoryStream, instance.Address);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.ApplicationId);
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      if (instance.Description) {
        StringProxy.Serialize(memoryStream, instance.Description);
      } else {
        num |= 2;
      }
      BooleanProxy.Serialize(memoryStream, instance.HasPicture);
      if (instance.Locale) {
        StringProxy.Serialize(memoryStream, instance.Locale);
      } else {
        num |= 4;
      }
      if (instance.Motto) {
        StringProxy.Serialize(memoryStream, instance.Motto);
      } else {
        num |= 8;
      }
      if (instance.Name) {
        StringProxy.Serialize(memoryStream, instance.Name);
      } else {
        num |= 16;
      }
      if (instance.Tag) {
        StringProxy.Serialize(memoryStream, instance.Tag);
      } else {
        num |= 32;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): GroupCreationView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let groupCreationView: GroupCreationView | null = null;
    if (num !== 0) {
      groupCreationView = new GroupCreationView();
      if ((num & 1) !== 0) {
        groupCreationView.Address = StringProxy.Deserialize(bytes);
      }
      groupCreationView.ApplicationId = Int32Proxy.Deserialize(bytes);
      groupCreationView.Cmid = Int32Proxy.Deserialize(bytes);
      if ((num & 2) !== 0) {
        groupCreationView.Description = StringProxy.Deserialize(bytes);
      }
      groupCreationView.HasPicture = BooleanProxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        groupCreationView.Locale = StringProxy.Deserialize(bytes);
      }
      if ((num & 8) !== 0) {
        groupCreationView.Motto = StringProxy.Deserialize(bytes);
      }
      if ((num & 16) !== 0) {
        groupCreationView.Name = StringProxy.Deserialize(bytes);
      }
      if ((num & 32) !== 0) {
        groupCreationView.Tag = StringProxy.Deserialize(bytes);
      }
    }
    return groupCreationView;
  }
}
