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

import { PhotonUsageType, RegionType } from '@/Cmune/DataCenter/Common/Entities';

export default class PhotonView {
  PhotonId: number;
  IP: string;
  Name: string;
  Region: RegionType;
  Port: number;
  UsageType: PhotonUsageType;
  MinLatency: number;

  constructor(params: Partial<PhotonView> = {}) {
    Object.assign(this, params);
  }
}
