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

import MemberWalletView from './MemberWalletView';
import PublicProfileView from './PublicProfileView';

export default class MemberView {
  PublicProfile: PublicProfileView = new PublicProfileView();
  MemberWallet: MemberWalletView = new MemberWalletView();
  MemberItems: number[] = [];

  constructor(params: Partial<MemberView> = {}) {
    Object.assign(this, params);
  }

  toString(): string {
    return `[Member view: ${this.PublicProfile != null && this.MemberWallet != null ? `${this.PublicProfile}${this.MemberWallet}[Items: ${this.MemberItems != null && this.MemberItems.length > 0 ? this.MemberItems.map((_) => _.toString()).join(', ') : 'No items'}]` : 'No member'}]`;
  }
}
