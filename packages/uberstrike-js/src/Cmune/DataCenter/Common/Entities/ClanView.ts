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

import BasicClanView from './BasicClanView';
import ClanMemberView from './ClanMemberView';

export default class ClanView extends BasicClanView {
  Members: ClanMemberView[];

  constructor(params: Partial<ClanView> = {}) {
    super(params);
    Object.assign(this, params);
  }

  override toString(): string {
    return `[Clan: ${super.toString()} [Members: ${this.Members.map((_) => _.toString())}]]`;
  }
}
