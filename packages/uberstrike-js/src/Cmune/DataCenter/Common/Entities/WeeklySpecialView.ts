export default class WeeklySpecialView {
  [key: string]: any;

  public Id: int;
  public Title: string;
  public Text: string;
  public ImageUrl: string;
  public ItemId: int;
  public StartDate: DateTime;
  public EndDate?: DateTime;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
