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

import EmailAddressStatus from './EmailAddressStatus';
import MemberAccessLevel from './MemberAccessLevel';

export default class PublicProfileView {
  Cmid: number;
  Name: string;
  IsChatDisabled: boolean;
  AccessLevel: MemberAccessLevel;
  GroupTag: string;
  LastLoginDate: Date;
  EmailAddressStatus: EmailAddressStatus;
  FacebookId: string;

  constructor(params: Partial<PublicProfileView> = {}) {
    Object.assign(this, params);
  }

  toString(): string {
    return `[Public profile: [Member name: ${this.Name}][CMID: ${this.Cmid}][Is banned from chat: ${this.IsChatDisabled}][Access level: ${this.AccessLevel}][Group tag: ${this.GroupTag}][Last login date: ${this.LastLoginDate}][EmailAddressStatus: ${this.EmailAddressStatus}][FacebookId: ${this.FacebookId}]]`;
  }
}
