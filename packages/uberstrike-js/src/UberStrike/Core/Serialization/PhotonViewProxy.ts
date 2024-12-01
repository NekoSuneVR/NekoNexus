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
import { PhotonUsageType, RegionType } from '@/Cmune/DataCenter/Common/Entities';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class PhotonViewProxy {
  static Serialize(stream: number[], instance: PhotonView) {
    let num = 0;
    const memoryStream: number[] = [];
    if (instance.IP) {
      StringProxy.Serialize(memoryStream, instance.IP);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.MinLatency);

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(memoryStream, instance.PhotonId);
    Int32Proxy.Serialize(memoryStream, instance.Port);
    EnumProxy.Serialize<RegionType>(memoryStream, instance.Region);
    EnumProxy.Serialize<PhotonUsageType>(memoryStream, instance.UsageType);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PhotonView {
    const num = Int32Proxy.Deserialize(bytes);
    const photonView = new PhotonView();

    if ((num & 1) !== 0) {
      photonView.IP = StringProxy.Deserialize(bytes);
    }

    photonView.MinLatency = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      photonView.Name = StringProxy.Deserialize(bytes);
    }

    photonView.PhotonId = Int32Proxy.Deserialize(bytes);
    photonView.Port = Int32Proxy.Deserialize(bytes);
    photonView.Region = EnumProxy.Deserialize<RegionType>(bytes);
    photonView.UsageType = EnumProxy.Deserialize<PhotonUsageType>(bytes);

    return photonView;
  }
}
