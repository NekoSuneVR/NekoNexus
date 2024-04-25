import ClanView from './ClanView';

export default class ClanRequestAcceptView {
  public ActionResult: int;
  public ClanRequestId: int;
  public ClanView: ClanView;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
