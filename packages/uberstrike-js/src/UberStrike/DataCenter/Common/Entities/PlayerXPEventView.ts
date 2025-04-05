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

export default class PlayerXPEventView {
  PlayerXPEventId: number;
  Name: string;
  XPMultiplier: number;

  constructor(params: Partial<PlayerXPEventView> = {}) {
    Object.assign(this, params);
  }

  toString(): string {
    return `[PlayerXPEventView: [PlayerXPEventId: ${this.PlayerXPEventId}][Name: ${this.Name}][XPMultiplier: ${this.XPMultiplier}]]`;
  }
}
