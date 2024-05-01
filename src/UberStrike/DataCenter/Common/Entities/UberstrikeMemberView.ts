import PlayerCardView from './PlayerCardView';
import PlayerStatisticsView from './PlayerStatisticsView';

export default class UberstrikeMemberView {
  [key: string]: any;

  public PlayerCardView: PlayerCardView;
  public PlayerStatisticsView: PlayerStatisticsView;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[Uberstrike member view: ${this.PlayerCardView ? this.PlayerCardView.toString() : ''}${this.PlayerStatisticsView ? this.PlayerStatisticsView.toString() : ''}]`;
  }
}
