export default class PlayerPersonalRecordStatisticsView {
  [key: string]: any;

  public MostHeadshots: int;
  public MostNutshots: int;
  public MostConsecutiveSnipes: int;
  public MostXPEarned: int;
  public MostSplats: int;
  public MostDamageDealt: int;
  public MostDamageReceived: int;
  public MostArmorPickedUp: int;
  public MostHealthPickedUp: int;
  public MostMeleeSplats: int;
  public MostHandgunSplats: int; // # LEGACY # //
  public MostMachinegunSplats: int;
  public MostShotgunSplats: int;
  public MostSniperSplats: int;
  public MostSplattergunSplats: int;
  public MostCannonSplats: int;
  public MostLauncherSplats: int;

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[PlayerPersonalRecordStatisticsView: [MostArmorPickedUp: ${this.MostArmorPickedUp}][MostCannonSplats: ${this.MostCannonSplats}][MostConsecutiveSnipes: ${this.MostConsecutiveSnipes}][MostDamageDealt: ${this.MostDamageDealt}][MostDamageReceived: ${this.MostDamageReceived}][MostHandgunSplats: ${this.MostHandgunSplats}][MostHeadshots: ${this.MostHeadshots}][MostHealthPickedUp: ${this.MostHealthPickedUp}][MostLauncherSplats: ${this.MostLauncherSplats}][MostMachinegunSplats: ${this.MostMachinegunSplats}][MostMeleeSplats: ${this.MostMeleeSplats}][MostNutshots: ${this.MostNutshots}][MostShotgunSplats: ${this.MostShotgunSplats}][MostSniperSplats: ${this.MostSniperSplats}][MostSplats: ${this.MostSplats}][MostSplattergunSplats: ${this.MostSplattergunSplats}][MostXPEarned: ${this.MostXPEarned}]]`;
  }
}
