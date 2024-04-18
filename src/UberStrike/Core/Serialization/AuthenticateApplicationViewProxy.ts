import { PhotonView } from '@/Cmune/Core/Models/Views';
import { AuthenticateApplicationView } from '@/UberStrike/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import PhotonViewProxy from './PhotonViewProxy';
import StringProxy from './StringProxy';

export default class AuthenticateApplicationViewProxy {
  public static Serialize(stream: Stream, instance: AuthenticateApplicationView) {
    let num = 0;
    const memoryStream: MemoryStream = [];

    if (instance.CommServer) {
      PhotonViewProxy.Serialize(memoryStream, instance.CommServer);
    } else {
      num |= 1;
    }

    if (instance.EncryptionInitVector) {
      StringProxy.Serialize(memoryStream, instance.EncryptionInitVector);
    } else {
      num |= 2;
    }

    if (instance.EncryptionPassPhrase) {
      StringProxy.Serialize(memoryStream, instance.EncryptionPassPhrase);
    } else {
      num |= 4;
    }

    if (instance.GameServers) {
      ListProxy.Serialize<PhotonView>(memoryStream, instance.GameServers, PhotonViewProxy.Serialize);
    } else {
      num |= 8;
    }

    BooleanProxy.Serialize(memoryStream, instance.IsEnabled);
    BooleanProxy.Serialize(memoryStream, instance.WarnPlayer);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): AuthenticateApplicationView {
    const num = Int32Proxy.Deserialize(bytes);
    const authenticateApplicationView = new AuthenticateApplicationView();

    if ((num & 1) !== 0) {
      authenticateApplicationView.CommServer = PhotonViewProxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      authenticateApplicationView.EncryptionInitVector = StringProxy.Deserialize(bytes);
    }

    if ((num & 4) !== 0) {
      authenticateApplicationView.EncryptionPassPhrase = StringProxy.Deserialize(bytes);
    }

    if ((num & 8) !== 0) {
      authenticateApplicationView.GameServers = ListProxy.Deserialize<PhotonView>(bytes, PhotonViewProxy.Deserialize);
    }

    authenticateApplicationView.IsEnabled = BooleanProxy.Deserialize(bytes);
    authenticateApplicationView.WarnPlayer = BooleanProxy.Deserialize(bytes);

    return authenticateApplicationView;
  }
}
