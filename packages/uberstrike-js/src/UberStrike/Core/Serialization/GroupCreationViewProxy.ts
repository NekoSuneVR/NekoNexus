import { GroupCreationView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class GroupCreationViewProxy {
  public static Serialize(stream: Stream, instance: GroupCreationView): void {
    let num = 0;
    const memoryStream: MemoryStream = [];
    if (instance.Address) {
      StringProxy.Serialize(memoryStream, instance.Address);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.ApplicationId);

    if (instance.AuthToken) {
      StringProxy.Serialize(memoryStream, instance.AuthToken);
    } else {
      num |= 2;
    }

    if (instance.Description) {
      StringProxy.Serialize(memoryStream, instance.Description);
    } else {
      num |= 4;
    }

    BooleanProxy.Serialize(memoryStream, instance.HasPicture);

    if (instance.Locale) {
      StringProxy.Serialize(memoryStream, instance.Locale);
    } else {
      num |= 8;
    }

    if (instance.Motto) {
      StringProxy.Serialize(memoryStream, instance.Motto);
    } else {
      num |= 16;
    }

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 32;
    }

    if (instance.Tag) {
      StringProxy.Serialize(memoryStream, instance.Tag);
    } else {
      num |= 64;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): GroupCreationView {
    const num = Int32Proxy.Deserialize(bytes);
    const groupCreationView = new GroupCreationView();

    if ((num & 1) !== 0) {
      groupCreationView.Address = StringProxy.Deserialize(bytes);
    }

    groupCreationView.ApplicationId = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      groupCreationView.AuthToken = StringProxy.Deserialize(bytes);
    }

    if ((num & 4) !== 0) {
      groupCreationView.Description = StringProxy.Deserialize(bytes);
    }

    groupCreationView.HasPicture = BooleanProxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      groupCreationView.Locale = StringProxy.Deserialize(bytes);
    }

    if ((num & 16) !== 0) {
      groupCreationView.Motto = StringProxy.Deserialize(bytes);
    }

    if ((num & 32) !== 0) {
      groupCreationView.Name = StringProxy.Deserialize(bytes);
    }

    if ((num & 64) !== 0) {
      groupCreationView.Tag = StringProxy.Deserialize(bytes);
    }

    return groupCreationView;
  }
}
