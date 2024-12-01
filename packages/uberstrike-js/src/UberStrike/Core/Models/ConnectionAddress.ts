/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export default class ConnectionAddress {
  Ipv4: number;
  Port: number;

  get ConnectionString(): string {
    return `${ConnectionAddress.ToString(this.Ipv4)}:${this.Port}`;
  }

  get IpAddress(): string {
    return ConnectionAddress.ToString(this.Ipv4);
  }

  constructor();
  constructor(connection?: string);
  constructor(ipAddress?: string, port?: number) {
    if (port === undefined) {
      try {
        const array = ipAddress!.split(':');
        this.Ipv4 = ConnectionAddress.ToInteger(array[0]);
        this.Port = Number(array[1]);
      } catch (error) {}
    } else {
      this.Ipv4 = ConnectionAddress.ToInteger(ipAddress!);
      this.Port = port;
    }
  }

  static ToString(ipv4: number): string {
    return `${(ipv4 >> 24) & 255}.${(ipv4 >> 16) & 255}.${(ipv4 >> 8) & 255}.${ipv4 & 255}`;
  }

  static ToInteger(ipAddress: string): number {
    let num = 0;
    const array = ipAddress.split('.');

    if (array.length === 4) {
      for (let i = 0; i < array.length; i++) {
        num |= Number(array[i]) << ((3 - i) * 8);
      }
    }

    return num;
  }
}
