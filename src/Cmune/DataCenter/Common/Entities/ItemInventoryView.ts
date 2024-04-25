export default class ItemInventoryView {
  public Cmid: int;
  public ItemId: int;
  public ExpirationDate?: DateTime;
  public AmountRemaining: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[LiveInventoryView: [Item Id: ${this.ItemId}][Expiration date: ${this.ExpirationDate}][Amount remaining:${this.AmountRemaining}]]`;
  }
}
