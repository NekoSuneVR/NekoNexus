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

import GroupColor from './GroupColor';
import GroupFontStyle from './GroupFontStyle';
import GroupType from './GroupType';

export default class BasicClanView {
  GroupId: number;
  MembersCount: number;
  Description: string;
  Name: string;
  Motto: string;
  Address: string;
  FoundingDate: Date;
  Picture: string;
  Type: GroupType;
  LastUpdated: Date;
  Tag: string;
  MembersLimit: number;
  ColorStyle: GroupColor;
  FontStyle: GroupFontStyle;
  ApplicationId: number;
  OwnerCmid: number;
  OwnerName: string;

  constructor(params: Partial<BasicClanView> = {}) {
    Object.assign(this, params);
  }

  toString(): string {
    return `[Clan: [Id: ${this.GroupId}][Members count: ${this.MembersCount}][Description: ${this.Description}][Name: ${this.Name}][Motto: ${this.Motto}][Address: ${this.Address}][Creation date: ${this.FoundingDate}][Picture: ${this.Picture}][Tyoe: ${this.Type}][Last updated: ${this.LastUpdated}][Tag: ${this.Tag}][Members limit: ${this.MembersLimit}][Color style: ${this.ColorStyle}][Font style: ${this.FontStyle}][Application id: ${this.ApplicationId}][Owner Cmid: ${this.OwnerCmid}][Owner name: ${this.OwnerName}]]`;
  }
}
