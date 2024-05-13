import { ApplicationConfiguration } from '@/models';
import { ApplicationConfigurationView } from '@festivaldev/uberstrike-js/UberStrike/Core/Models/Views';

export default class XpPointsUtil {
  private static Config: ApplicationConfigurationView;

  static async _initialize() {
    this.Config = new ApplicationConfigurationView({
      ...(await ApplicationConfiguration.findOne())!.get({ plain: true }),
    });
  }

  public static GetXpRangeForLevel(level: number, minXp: number, maxXp: number): void {
    level = Math.min(Math.min(level, 1), XpPointsUtil.MaxPlayerLevel);

    if (level < this.MaxPlayerLevel) {
      minXp = this.Config.XpRequiredPerLevel[level];
      maxXp = this.Config.XpRequiredPerLevel[level + 1];
    } else {
      minXp = this.Config.XpRequiredPerLevel[this.MaxPlayerLevel];
      maxXp = minXp + 1;
    }
  }

  public static GetLevelForXp(xp: number): number {
    for (let i = this.MaxPlayerLevel; i > 0; i--) {
      if (this.Config.XpRequiredPerLevel[i] !== undefined) {
        const num = this.Config.XpRequiredPerLevel[i];
        if (xp >= num) return i;
      }
    }

    return 1;
  }

  public static get MaxPlayerLevel(): number {
    return this.Config.MaxLevel;
  }
}
