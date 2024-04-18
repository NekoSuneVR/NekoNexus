import { ChannelType, CurrencyDepositView, PaymentProviderType } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import DateTimeProxy from './DateTimeProxy';
import DecimalProxy from './DecimalProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class CurrencyDepositViewProxy {
  public static Serialize(stream: Stream, instance: CurrencyDepositView): void {
    let num = 0;
    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.ApplicationId);

    if (instance.BundleId) {
      const stream2 = memoryStream;
      const bundleId = instance.BundleId;
      Int32Proxy.Serialize(stream2, (Number.isNaN(bundleId)) ? 0 : bundleId);
    } else {
      num |= 1;
    }

    if (instance.BundleName) {
      StringProxy.Serialize(memoryStream, instance.BundleName);
    } else {
      num |= 2;
    }

    DecimalProxy.Serialize(memoryStream, instance.Cash);
    EnumProxy.Serialize<ChannelType>(memoryStream, instance.ChannelId);
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    Int32Proxy.Serialize(memoryStream, instance.Credits);
    Int32Proxy.Serialize(memoryStream, instance.CreditsDepositId);

    if (instance.CurrencyLabel) {
      StringProxy.Serialize(memoryStream, instance.CurrencyLabel);
    } else {
      num |= 4;
    }

    DateTimeProxy.Serialize(memoryStream, instance.DepositDate);
    BooleanProxy.Serialize(memoryStream, instance.IsAdminAction);
    EnumProxy.Serialize<PaymentProviderType>(memoryStream, instance.PaymentProviderId);
    Int32Proxy.Serialize(memoryStream, instance.Points);

    if (instance.TransactionKey) {
      StringProxy.Serialize(memoryStream, instance.TransactionKey);
    } else {
      num |= 8;
    }

    DecimalProxy.Serialize(memoryStream, instance.UsdAmount);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): CurrencyDepositView {
    const num = Int32Proxy.Deserialize(bytes);
    const currencyDepositView = new CurrencyDepositView();
    currencyDepositView.ApplicationId = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      currencyDepositView.BundleId = Int32Proxy.Deserialize(bytes);
    }

    if ((num & 2) !== 0) {
      currencyDepositView.BundleName = StringProxy.Deserialize(bytes);
    }

    currencyDepositView.Cash = DecimalProxy.Deserialize(bytes);
    currencyDepositView.ChannelId = EnumProxy.Deserialize<ChannelType>(bytes);
    currencyDepositView.Cmid = Int32Proxy.Deserialize(bytes);
    currencyDepositView.Credits = Int32Proxy.Deserialize(bytes);
    currencyDepositView.CreditsDepositId = Int32Proxy.Deserialize(bytes);

    if ((num & 4) !== 0) {
      currencyDepositView.CurrencyLabel = StringProxy.Deserialize(bytes);
    }

    currencyDepositView.DepositDate = DateTimeProxy.Deserialize(bytes);
    currencyDepositView.IsAdminAction = BooleanProxy.Deserialize(bytes);
    currencyDepositView.PaymentProviderId = EnumProxy.Deserialize<PaymentProviderType>(bytes);
    currencyDepositView.Points = Int32Proxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      currencyDepositView.TransactionKey = StringProxy.Deserialize(bytes);
    }

    currencyDepositView.UsdAmount = DecimalProxy.Deserialize(bytes);

    return currencyDepositView;
  }
}
