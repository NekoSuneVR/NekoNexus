import { ParadiseMapView } from '@/UberStrike/Core/Models/Views';
import MapViewProxy from './MapViewProxy';
import StringProxy from './StringProxy';

export default class ParadiseMapViewProxy {
  public static Serialize(stream: Stream, instance: ParadiseMapView): void {
    const memoryStream: MemoryStream = [];
    MapViewProxy.Serialize(memoryStream, instance);
    StringProxy.Serialize(memoryStream, instance.FileName);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ParadiseMapView {
    const mapView = MapViewProxy.Deserialize(bytes) as ParadiseMapView;
    mapView.FileName = StringProxy.Deserialize(bytes);

    return mapView;
  }
}
