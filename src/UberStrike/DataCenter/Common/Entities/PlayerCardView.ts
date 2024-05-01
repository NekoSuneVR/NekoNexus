export default class PlayerCardView {
  [key: string]: any;

  public Name: string;
  public Cmid: int;
  public Splats: int;
  public Splatted: int;
  public Precision: string;
  public Ranking: int;
  public Shots: long;
  public Hits: long;
  public TagName: string;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public CompareTo(obj: any): int {
    if (obj instanceof PlayerCardView) {
      const playerCardView = obj as PlayerCardView;

      return -(playerCardView.Ranking - this.Ranking);
    }

    throw new Error('ArgumentOutOfRangeException: Parameter is not of the good type');
  }

  public toString(): string {
    return `[Player: [Name: ${this.Name}][Cmid: ${this.Cmid}][Splats: ${this.Splats}][Shots: ${this.Shots}][Hits: ${this.Hits}][Splatted: ${this.Splatted}][Precision: ${this.Precision}][Ranking: ${this.Ranking}][TagName: ${this.TagName}]]`;
  }
}
