export default class ContactRequestDeclineView {
  [key: string]: any;

  public ActionResult: int;
  public RequestId: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
