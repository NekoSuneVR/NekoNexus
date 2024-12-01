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
import MapSettings from './MapSettings';

export default class MapView {
  MapId: number;
  DisplayName: string;
  Description: string;
  SceneName: string;
  IsBlueBox: boolean;
  RecommendedItemId: number;
  SupportedGameModes: number;
  SupportedItemClass: number;
  MaxPlayers: number;
  FileName: string; // # LEGACY # //
  Settings: Record<GameModeType, MapSettings | null>;

  constructor(params: Partial<MapView> = {}) {
    Object.assign(this, params);
  }
}
