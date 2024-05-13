export default class LiveFeedView {
  [key: string]: any;

  public Date: DateTime = new Date();
  public Priority: int;
  public Description: string;
  public Url: string;
  public LivedFeedId: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
