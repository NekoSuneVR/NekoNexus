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

import { PhotonServerLoad } from '@/Cmune/Core/Models';
import Int32Proxy from './Int32Proxy';
import SingleProxy from './SingleProxy';

export default class PhotonServerLoadProxy {
  static Serialize(stream: number[], instance: PhotonServerLoad): void {
    const memoryStream: number[] = [];
    SingleProxy.Serialize(memoryStream, instance.MaxPlayerCount);
    Int32Proxy.Serialize(memoryStream, instance.PeersConnected);
    Int32Proxy.Serialize(memoryStream, instance.PlayersConnected);
    Int32Proxy.Serialize(memoryStream, instance.RoomsCreated);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PhotonServerLoad {
    return new PhotonServerLoad({
      MaxPlayerCount: SingleProxy.Deserialize(bytes),
      PeersConnected: Int32Proxy.Deserialize(bytes),
      PlayersConnected: Int32Proxy.Deserialize(bytes),
      RoomsCreated: Int32Proxy.Deserialize(bytes),
    });
  }
}
