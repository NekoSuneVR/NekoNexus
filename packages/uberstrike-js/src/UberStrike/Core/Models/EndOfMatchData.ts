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

import StatsCollection from './StatsCollection';
import StatsSummary from './StatsSummary';

export default class EndOfMatchData {
  MostValuablePlayers: StatsSummary[];
  MostEffecientWeaponId: number;
  PlayerStatsTotal: StatsCollection;
  PlayerStatsBestPerLife: StatsCollection;
  PlayerXpEarned: { [key: number]: number };
  TimeInGameMinutes: number;
  HasWonMatch: boolean;
  MatchGuid: string;

  constructor(params: Partial<EndOfMatchData> = {}) {
    Object.assign(this, params);
  }
}
