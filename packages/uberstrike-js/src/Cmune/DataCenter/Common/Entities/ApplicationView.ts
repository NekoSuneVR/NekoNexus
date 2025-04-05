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

import { PhotonView } from '@/Cmune/Core/Models/Views';
import BuildType from './BuildType';
import ChannelType from './ChannelType';

export default class ApplicationView {
  ApplicationVersionId: number;
  Version: string;
  Build: BuildType;
  Channel: ChannelType;
  FileName: string;
  ReleaseDate: Date;
  ExpirationDate?: Date;
  RemainingTime: number;
  IsCurrent: boolean;
  Servers: PhotonView[] = [];
  SupportUrl: string;
  PhotonGroupId: number;
  PhotonGroupName: string;

  constructor(params: Partial<ApplicationView> = {}) {
    Object.assign(this, params);

    let num = -1;

    if (params.ExpirationDate != null) {
      const value = params.ExpirationDate;

      if (value.getTime() - new Date().getTime() <= 0) {
        num = 0;
      } else {
        num = Math.floor((new Date().getTime() - value.getTime()) / 1000 / 60);
      }

      this.RemainingTime = num;
    }
  }

  toString(): string {
    return `[Application: [ID: ${this.ApplicationVersionId}][version: ${this.Version}][Builld: ${this.Build}][Channel: ${this.Channel}][File name: ${this.FileName}][Release date: ${this.ReleaseDate}][Expiration date: ${this.ExpirationDate}][Remaining time: ${this.RemainingTime}][Is current: ${this.IsCurrent}][Support URL: ${this.SupportUrl}][Servers]${this.Servers.map((_) => _.toString()).join('')}[/Servers]]`;
  }
}
