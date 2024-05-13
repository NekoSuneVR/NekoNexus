export default class AccountCompletionResultView {
  [key: string]: any;

  public Result: int;
  public ItemsAttributed?: Dictionary<int, int> = {};
  public NonDuplicateNames?: List<string> = [];

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }
}
