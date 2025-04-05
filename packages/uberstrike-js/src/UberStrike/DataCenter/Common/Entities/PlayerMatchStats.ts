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

import PlayerPersonalRecordStatisticsView from './PlayerPersonalRecordStatisticsView';
import PlayerWeaponStatisticsView from './PlayerWeaponStatisticsView';

export default class PlayerMatchStats {
  Cmid: number;
  Kills: number;
  Death: number;
  Shots: bigint;
  Hits: bigint;
  TimeSpentInGame: number;
  Headshots: number;
  Nutshots: number;
  Smackdowns: number;
  HasFinishedMatch: boolean;
  HasWonMatch: boolean;
  PersonalRecord: PlayerPersonalRecordStatisticsView;
  WeaponStatistics: PlayerWeaponStatisticsView;

  constructor(params: Partial<PlayerMatchStats> = {}) {
    Object.assign(this, params);
  }
}
