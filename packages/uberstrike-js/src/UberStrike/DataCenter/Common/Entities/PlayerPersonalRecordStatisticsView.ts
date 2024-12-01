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

export default class PlayerPersonalRecordStatisticsView {
  MostHeadshots: number;
  MostNutshots: number;
  MostConsecutiveSnipes: number;
  MostXPEarned: number;
  MostSplats: number;
  MostDamageDealt: number;
  MostDamageReceived: number;
  MostArmorPickedUp: number;
  MostHealthPickedUp: number;
  MostMeleeSplats: number;
  MostHandgunSplats: number; // # LEGACY # //
  MostMachinegunSplats: number;
  MostShotgunSplats: number;
  MostSniperSplats: number;
  MostSplattergunSplats: number;
  MostCannonSplats: number;
  MostLauncherSplats: number;

  constructor(params: Partial<PlayerPersonalRecordStatisticsView> = {}) {
    Object.assign(this, params);
  }

  toString(): string {
    return `[PlayerPersonalRecordStatisticsView: [MostArmorPickedUp: ${this.MostArmorPickedUp}][MostCannonSplats: ${this.MostCannonSplats}][MostConsecutiveSnipes: ${this.MostConsecutiveSnipes}][MostDamageDealt: ${this.MostDamageDealt}][MostDamageReceived: ${this.MostDamageReceived}][MostHandgunSplats: ${this.MostHandgunSplats}][MostHeadshots: ${this.MostHeadshots}][MostHealthPickedUp: ${this.MostHealthPickedUp}][MostLauncherSplats: ${this.MostLauncherSplats}][MostMachinegunSplats: ${this.MostMachinegunSplats}][MostMeleeSplats: ${this.MostMeleeSplats}][MostNutshots: ${this.MostNutshots}][MostShotgunSplats: ${this.MostShotgunSplats}][MostSniperSplats: ${this.MostSniperSplats}][MostSplats: ${this.MostSplats}][MostSplattergunSplats: ${this.MostSplattergunSplats}][MostXPEarned: ${this.MostXPEarned}]]`;
  }
}
