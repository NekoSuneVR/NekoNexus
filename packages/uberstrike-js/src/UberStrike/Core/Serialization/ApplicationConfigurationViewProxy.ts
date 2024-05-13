import { ApplicationConfigurationView } from '@/UberStrike/Core/Models/Views';
import DictionaryProxy from './DictionaryProxy';
import Int32Proxy from './Int32Proxy';

export default class ApplicationConfigurationViewProxy {
  public static Serialize(stream: Stream, instance: ApplicationConfigurationView): void {
    let num = 0;
    const memoryStream: MemoryStream = [];

    Int32Proxy.Serialize(memoryStream, instance.MaxLevel);
    Int32Proxy.Serialize(memoryStream, instance.MaxXp);
    Int32Proxy.Serialize(memoryStream, instance.PointsBaseLoser);
    Int32Proxy.Serialize(memoryStream, instance.PointsBaseWinner);
    Int32Proxy.Serialize(memoryStream, instance.PointsHeadshot);
    Int32Proxy.Serialize(memoryStream, instance.PointsKill);
    Int32Proxy.Serialize(memoryStream, instance.PointsNutshot);
    Int32Proxy.Serialize(memoryStream, instance.PointsPerMinuteLoser);
    Int32Proxy.Serialize(memoryStream, instance.PointsPerMinuteWinner);
    Int32Proxy.Serialize(memoryStream, instance.PointsSmackdown);
    Int32Proxy.Serialize(memoryStream, instance.XpBaseLoser);
    Int32Proxy.Serialize(memoryStream, instance.XpBaseWinner);
    Int32Proxy.Serialize(memoryStream, instance.XpHeadshot);
    Int32Proxy.Serialize(memoryStream, instance.XpKill);
    Int32Proxy.Serialize(memoryStream, instance.XpNutshot);
    Int32Proxy.Serialize(memoryStream, instance.XpPerMinuteLoser);
    Int32Proxy.Serialize(memoryStream, instance.XpPerMinuteWinner);

    if (instance.XpRequiredPerLevel) {
      DictionaryProxy.Serialize<int, int>(
        memoryStream,
        instance.XpRequiredPerLevel,
        Int32Proxy.Serialize,
        Int32Proxy.Serialize,
      );
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.XpSmackdown);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): ApplicationConfigurationView {
    const num = Int32Proxy.Deserialize(bytes);
    const applicationConfigurationView = new ApplicationConfigurationView();
    applicationConfigurationView.MaxLevel = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.MaxXp = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.PointsBaseLoser = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.PointsBaseWinner = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.PointsHeadshot = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.PointsKill = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.PointsNutshot = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.PointsPerMinuteLoser = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.PointsPerMinuteWinner = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.PointsSmackdown = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.XpBaseLoser = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.XpBaseWinner = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.XpHeadshot = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.XpKill = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.XpNutshot = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.XpPerMinuteLoser = Int32Proxy.Deserialize(bytes);
    applicationConfigurationView.XpPerMinuteWinner = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      applicationConfigurationView.XpRequiredPerLevel = DictionaryProxy.Deserialize<number, number>(
        bytes,
        Int32Proxy.Deserialize,
        Int32Proxy.Deserialize,
      );
    }

    applicationConfigurationView.XpSmackdown = Int32Proxy.Deserialize(bytes);

    return applicationConfigurationView;
  }
}
