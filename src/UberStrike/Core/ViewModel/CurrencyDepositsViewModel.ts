import { CurrencyDepositView } from '@/Cmune/DataCenter/Common/Entities';

export default class CurrencyDepositsViewModel {
  public CurrencyDeposits: List<CurrencyDepositView>;
  public TotalCount: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
