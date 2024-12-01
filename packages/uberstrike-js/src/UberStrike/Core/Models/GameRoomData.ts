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

import { GameModeType } from '@/UberStrike/Core/Types';
import RoomData from './RoomData';

export default class GameRoomData extends RoomData {
  ConnectedPlayers: number;
  PlayerLimit: number;
  TimeLimit: number;
  KillLimit: number;
  GameFlags: number;
  MapID: number;
  LevelMin: number;
  LevelMax: number;
  GameMode: GameModeType;
  IsPermanentGame: boolean;

  constructor(params: Partial<GameRoomData> = {}) {
    super(params);
    Object.assign(this, params);
  }

  get IsFull(): boolean {
    return this.ConnectedPlayers >= this.PlayerLimit;
  }
}
