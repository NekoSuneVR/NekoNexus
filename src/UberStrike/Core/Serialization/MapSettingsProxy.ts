import { MapSettings } from '@/UberStrike/Core/Models/Views';
import Int32Proxy from './Int32Proxy';

export default class MapSettingsProxy {
  public static Serialize(stream: Stream, instance: MapSettings): void {
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
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): MapSettings {
    return new MapSettings({
      KillsCurrent: Int32Proxy.Deserialize(bytes),
      KillsMax: Int32Proxy.Deserialize(bytes),
      KillsMin: Int32Proxy.Deserialize(bytes),
      PlayersCurrent: Int32Proxy.Deserialize(bytes),
      PlayersMax: Int32Proxy.Deserialize(bytes),
      PlayersMin: Int32Proxy.Deserialize(bytes),
      TimeCurrent: Int32Proxy.Deserialize(bytes),
      TimeMax: Int32Proxy.Deserialize(bytes),
      TimeMin: Int32Proxy.Deserialize(bytes),
    });
  }
}
