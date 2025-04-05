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

import GroupPosition from './GroupPosition';

export default class ClanMemberView {
  Name: string;
  Cmid: number;
  Position: GroupPosition;
  JoiningDate: Date;
  Lastlogin: Date;

  constructor(params: Partial<ClanMemberView> = {}) {
    Object.assign(this, params);
  }

  toString(): string {
    return `[Clan member: [Name: ${this.Name}][Cmid: ${this.Cmid}][Position: ${this.Position}][JoiningDate: ${this.JoiningDate}][Lastlogin: ${this.Lastlogin}]]`;
  }
}
