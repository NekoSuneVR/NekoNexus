import { PlayerPersonalRecordStatisticsView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from './Int32Proxy';

export default class PlayerPersonalRecordStatisticsViewProxy {
  public static Serialize(stream: Stream, instance: PlayerPersonalRecordStatisticsView): void {
    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.MostArmorPickedUp);
    Int32Proxy.Serialize(memoryStream, instance.MostCannonSplats);
    Int32Proxy.Serialize(memoryStream, instance.MostConsecutiveSnipes);
    Int32Proxy.Serialize(memoryStream, instance.MostDamageDealt);
    Int32Proxy.Serialize(memoryStream, instance.MostDamageReceived);
    Int32Proxy.Serialize(memoryStream, instance.MostHeadshots);
    Int32Proxy.Serialize(memoryStream, instance.MostHealthPickedUp);
    Int32Proxy.Serialize(memoryStream, instance.MostLauncherSplats);
    Int32Proxy.Serialize(memoryStream, instance.MostMachinegunSplats);
    Int32Proxy.Serialize(memoryStream, instance.MostMeleeSplats);
    Int32Proxy.Serialize(memoryStream, instance.MostNutshots);
    Int32Proxy.Serialize(memoryStream, instance.MostShotgunSplats);
    Int32Proxy.Serialize(memoryStream, instance.MostSniperSplats);
    Int32Proxy.Serialize(memoryStream, instance.MostSplats);
    Int32Proxy.Serialize(memoryStream, instance.MostSplattergunSplats);
    Int32Proxy.Serialize(memoryStream, instance.MostXPEarned);

    Int32Proxy.Serialize(memoryStream, instance.MostHandgunSplats);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): PlayerPersonalRecordStatisticsView {
    return new PlayerPersonalRecordStatisticsView({
      MostArmorPickedUp: Int32Proxy.Deserialize(bytes),
      MostCannonSplats: Int32Proxy.Deserialize(bytes),
      MostConsecutiveSnipes: Int32Proxy.Deserialize(bytes),
      MostDamageDealt: Int32Proxy.Deserialize(bytes),
      MostDamageReceived: Int32Proxy.Deserialize(bytes),
      MostHeadshots: Int32Proxy.Deserialize(bytes),
      MostHealthPickedUp: Int32Proxy.Deserialize(bytes),
      MostLauncherSplats: Int32Proxy.Deserialize(bytes),
      MostMachinegunSplats: Int32Proxy.Deserialize(bytes),
      MostMeleeSplats: Int32Proxy.Deserialize(bytes),
      MostNutshots: Int32Proxy.Deserialize(bytes),
      MostShotgunSplats: Int32Proxy.Deserialize(bytes),
      MostSniperSplats: Int32Proxy.Deserialize(bytes),
      MostSplats: Int32Proxy.Deserialize(bytes),
      MostSplattergunSplats: Int32Proxy.Deserialize(bytes),
      MostXPEarned: Int32Proxy.Deserialize(bytes),

      MostHandgunSplats: Int32Proxy.Deserialize(bytes),
    });
  }
}
