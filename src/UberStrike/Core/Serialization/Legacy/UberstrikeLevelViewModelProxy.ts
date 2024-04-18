import { MapView } from '@/UberStrike/Core/Models/Views';
import { UberstrikeLevelViewModel } from '@/UberStrike/Core/ViewModel';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import MapViewProxy from './MapViewProxy';

export default class UberstrikeLevelViewModelProxy {
  public static Serialize(stream: Stream, instance: UberstrikeLevelViewModel): void {
    let num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      if (instance.Maps) {
        ListProxy.Serialize<MapView>(memoryStream, instance.Maps, MapViewProxy.Serialize);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): UberstrikeLevelViewModel | null {
    const num = Int32Proxy.Deserialize(bytes);
    let uberstrikeLevelViewModel: UberstrikeLevelViewModel | null = null;
    if (num !== 0) {
      uberstrikeLevelViewModel = new UberstrikeLevelViewModel();
      if ((num & 1) !== 0) {
        uberstrikeLevelViewModel.Maps = ListProxy.Deserialize<MapView>(bytes, MapViewProxy.Deserialize);
      }
    }
    return uberstrikeLevelViewModel;
  }
}
