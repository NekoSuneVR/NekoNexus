import PointsDepositType from './PointsDepositType';

export default class PointDepositView {
  [key: string]: any;

  public PointDepositId: int;
  public DepositDate: DateTime;
  public Points: int;
  public Cmid: int;
  public IsAdminAction: bool;
  public DepositType: PointsDepositType;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
