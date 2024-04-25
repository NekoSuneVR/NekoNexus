import ClaimFacebookGiftResult from './ClaimFacebookGiftResult';

export default class ClaimFacebookGiftView {
  public ClaimResult: ClaimFacebookGiftResult;
  public ItemId?: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
