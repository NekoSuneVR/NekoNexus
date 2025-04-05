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

import { ConnectionAddress } from '@/UberStrike/Core/Models';
import Int32Proxy from './Int32Proxy';
import UInt16Proxy from './UInt16Proxy';

export default class ConnectionAddressProxy {
  static Serialize(stream: number[], instance: ConnectionAddress): void {
    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.Ipv4);
    UInt16Proxy.Serialize(memoryStream, instance.Port);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: any): ConnectionAddress {
    const connectionAddress = new ConnectionAddress('');
    connectionAddress.Ipv4 = Int32Proxy.Deserialize(bytes);
    connectionAddress.Port = UInt16Proxy.Deserialize(bytes);

    return connectionAddress;
  }
}
