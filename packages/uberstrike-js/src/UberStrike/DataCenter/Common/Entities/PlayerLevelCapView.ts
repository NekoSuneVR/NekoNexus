export default class PlayerLevelCapView {
  [key: string]: any;

  public PlayerLevelCapId: int;
  public Level: int;
  public XPRequired: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[PlayerLevelCapView: [PlayerLevelCapId: ${this.PlayerLevelCapId}][Level: ${this.Level}][XPRequired: ${this.XPRequired}]]`;
  }
}
