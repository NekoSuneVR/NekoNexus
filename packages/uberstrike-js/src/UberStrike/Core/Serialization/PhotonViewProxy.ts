import { PhotonView } from '@/Cmune/Core/Models/Views';
import { PhotonUsageType, RegionType } from '@/Cmune/DataCenter/Common/Entities';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class PhotonViewProxy {
  public static Serialize(stream: Stream, instance: PhotonView) {
    let num = 0;
    const memoryStream: MemoryStream = [];
    if (instance.IP) {
      StringProxy.Serialize(memoryStream, instance.IP);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.MinLatency);

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(memoryStream, instance.PhotonId);
    Int32Proxy.Serialize(memoryStream, instance.Port);
    EnumProxy.Serialize<RegionType>(memoryStream, instance.Region);
    EnumProxy.Serialize<PhotonUsageType>(memoryStream, instance.UsageType);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): PhotonView {
    const num = Int32Proxy.Deserialize(bytes);
    const photonView = new PhotonView();

    if ((num & 1) !== 0) {
      photonView.IP = StringProxy.Deserialize(bytes);
    }

    photonView.MinLatency = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      photonView.Name = StringProxy.Deserialize(bytes);
    }

    photonView.PhotonId = Int32Proxy.Deserialize(bytes);
    photonView.Port = Int32Proxy.Deserialize(bytes);
    photonView.Region = EnumProxy.Deserialize<RegionType>(bytes);
    photonView.UsageType = EnumProxy.Deserialize<PhotonUsageType>(bytes);

    return photonView;
  }
}
