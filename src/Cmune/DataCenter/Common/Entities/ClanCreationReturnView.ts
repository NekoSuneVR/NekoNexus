import ClanView from './ClanView';

export default class ClanCreationReturnView {
  [key: string]: any;

  public ResultCode: int;
  public ClanView: ClanView;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
