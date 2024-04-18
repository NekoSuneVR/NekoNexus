import { MapSettings } from '@/UberStrike/Core/Models/Views';
import Int32Proxy from '../Int32Proxy';

export default class MapSettingsProxy {
  public static Serialize(stream: Stream, instance: MapSettings): void {
    const num = 0;
    if (instance) {
      const memoryStream: MemoryStream = [];
      Int32Proxy.Serialize(memoryStream, instance.KillsCurrent);
      Int32Proxy.Serialize(memoryStream, instance.KillsMax);
      Int32Proxy.Serialize(memoryStream, instance.KillsMin);
      Int32Proxy.Serialize(memoryStream, instance.PlayersCurrent);
      Int32Proxy.Serialize(memoryStream, instance.PlayersMax);
      Int32Proxy.Serialize(memoryStream, instance.PlayersMin);
      Int32Proxy.Serialize(memoryStream, instance.TimeCurrent);
      Int32Proxy.Serialize(memoryStream, instance.TimeMax);
      Int32Proxy.Serialize(memoryStream, instance.TimeMin);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.WriteTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  public static Deserialize(bytes: Stream): MapSettings | null {
    const num = Int32Proxy.Deserialize(bytes);
    let mapSettings: MapSettings | null = null;
    if (num !== 0) {
      mapSettings = new MapSettings();
      mapSettings.KillsCurrent = Int32Proxy.Deserialize(bytes);
      mapSettings.KillsMax = Int32Proxy.Deserialize(bytes);
      mapSettings.KillsMin = Int32Proxy.Deserialize(bytes);
      mapSettings.PlayersCurrent = Int32Proxy.Deserialize(bytes);
      mapSettings.PlayersMax = Int32Proxy.Deserialize(bytes);
      mapSettings.PlayersMin = Int32Proxy.Deserialize(bytes);
      mapSettings.TimeCurrent = Int32Proxy.Deserialize(bytes);
      mapSettings.TimeMax = Int32Proxy.Deserialize(bytes);
      mapSettings.TimeMin = Int32Proxy.Deserialize(bytes);
    }
    return mapSettings;
  }
}
