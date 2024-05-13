import { PhotonView } from '@/Cmune/Core/Models/Views';
import { GameApplicationView } from '@/UberStrike/Core/ViewModel';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import PhotonViewProxy from './PhotonViewProxy';
import StringProxy from './StringProxy';

export default class GameApplicationViewProxy {
  public static Serialize(stream: Stream, instance: GameApplicationView): void {
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

    if (instance.SupportUrl) {
      StringProxy.Serialize(memoryStream, instance.SupportUrl);
    } else {
      num |= 16;
    }

    if (instance.Version) {
      StringProxy.Serialize(memoryStream, instance.Version);
    } else {
      num |= 32;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): GameApplicationView {
    const num = Int32Proxy.Deserialize(bytes);
    const gameApplicationView = new GameApplicationView();

    if ((num & 1) !== 0) {
      gameApplicationView.CommServer = PhotonViewProxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      gameApplicationView.EncryptionInitVector = StringProxy.Deserialize(bytes);
    }

    if ((num & 4) !== 0) {
      gameApplicationView.EncryptionPassPhrase = StringProxy.Deserialize(bytes);
    }

    if ((num & 8) !== 0) {
      gameApplicationView.GameServers = ListProxy.Deserialize<PhotonView>(bytes, PhotonViewProxy.Deserialize);
    }

    if ((num & 16) !== 0) {
      gameApplicationView.SupportUrl = StringProxy.Deserialize(bytes);
    }

    if ((num & 32) !== 0) {
      gameApplicationView.Version = StringProxy.Deserialize(bytes);
    }

    return gameApplicationView;
  }
}
