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

export default class ApplicationConfigurationView {
  XpRequiredPerLevel: { [key: number]: number };
  MaxLevel: number;
  MaxXp: number;
  XpKill: number;
  XpSmackdown: number;
  XpHeadshot: number;
  XpNutshot: number;
  XpPerMinuteLoser: number;
  XpPerMinuteWinner: number;
  XpBaseLoser: number;
  XpBaseWinner: number;
  PointsKill: number;
  PointsSmackdown: number;
  PointsHeadshot: number;
  PointsNutshot: number;
  PointsPerMinuteLoser: number;
  PointsPerMinuteWinner: number;
  PointsBaseLoser: number;
  PointsBaseWinner: number;

  constructor(params: Partial<ApplicationConfigurationView> = {}) {
    Object.assign(this, params);
  }
}
