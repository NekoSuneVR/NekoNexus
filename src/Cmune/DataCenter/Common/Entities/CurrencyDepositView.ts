import ChannelType from './ChannelType';
import PaymentProviderType from './PaymentProviderType';

export default class CurrencyDepositView {
  public CreditsDepositId: int;
  public DepositDate: DateTime;
  public Credits: int;
  public Points: int;
  public Cash: decimal;
  public CurrencyLabel: string;
  public Cmid: int;
  public IsAdminAction: bool;
  public PaymentProviderId: PaymentProviderType;
  public TransactionKey: string;
  public ApplicationId: int;
  public ChannelId: ChannelType;
  public UsdAmount: decimal;
  public BundleId?: int;
  public BundleName: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
