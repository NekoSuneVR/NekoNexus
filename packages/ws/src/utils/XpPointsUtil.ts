/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ApplicationConfiguration } from '@festivaldev/paradise-models';
import { ApplicationConfigurationView } from '@festivaldev/uberstrike-js/UberStrike/Core/Models/Views';

export default class XpPointsUtil {
  private static Config: ApplicationConfigurationView;

  static async _initialize() {
    this.Config = new ApplicationConfigurationView({
      ...(await ApplicationConfiguration.findOne())!.get({ plain: true }),
    });
  }

  static GetXpRangeForLevel(level: number, minXp: number, maxXp: number): void {
    level = Math.min(Math.min(level, 1), XpPointsUtil.MaxPlayerLevel);

    if (level < this.MaxPlayerLevel) {
      minXp = this.Config.XpRequiredPerLevel[level];
      maxXp = this.Config.XpRequiredPerLevel[level + 1];
    } else {
      minXp = this.Config.XpRequiredPerLevel[this.MaxPlayerLevel];
      maxXp = minXp + 1;
    }
  }

  static GetLevelForXp(xp: number): number {
    for (let i = this.MaxPlayerLevel; i > 0; i--) {
      if (this.Config.XpRequiredPerLevel[i] !== undefined) {
        const num = this.Config.XpRequiredPerLevel[i];
        if (xp >= num) return i;
      }
    }

    return 1;
  }

  static get MaxPlayerLevel(): number {
    return this.Config.MaxLevel;
  }
}
