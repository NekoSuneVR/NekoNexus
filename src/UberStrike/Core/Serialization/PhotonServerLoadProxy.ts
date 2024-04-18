import { PhotonServerLoad } from '@/Cmune/Core/Models';
import Int32Proxy from './Int32Proxy';
import SingleProxy from './SingleProxy';

export default class PhotonServerLoadProxy {
  public static Serialize(stream: Stream, instance: PhotonServerLoad): void {
    const memoryStream: MemoryStream = [];
    SingleProxy.Serialize(memoryStream, instance.MaxPlayerCount);
    Int32Proxy.Serialize(memoryStream, instance.PeersConnected);
    Int32Proxy.Serialize(memoryStream, instance.PlayersConnected);
    Int32Proxy.Serialize(memoryStream, instance.RoomsCreated);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): PhotonServerLoad {
    return new PhotonServerLoad({
      MaxPlayerCount: SingleProxy.Deserialize(bytes),
      PeersConnected: Int32Proxy.Deserialize(bytes),
      PlayersConnected: Int32Proxy.Deserialize(bytes),
      RoomsCreated: Int32Proxy.Deserialize(bytes),
    });
  }
}
