export default class PlayerXPEventView {
  [key: string]: any;

  public PlayerXPEventId: int;
  public Name: string;
  public XPMultiplier: decimal;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[PlayerXPEventView: [PlayerXPEventId: ${this.PlayerXPEventId}][Name: ${this.Name}][XPMultiplier: ${this.XPMultiplier}]]`;
  }
}
