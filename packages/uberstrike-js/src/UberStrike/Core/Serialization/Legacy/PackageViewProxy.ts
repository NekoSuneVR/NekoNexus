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

import { PackageView } from '@/Cmune/DataCenter/Common/Entities';
import DecimalProxy from '../DecimalProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';

export default class PackageViewProxy {
  static Serialize(stream: number[], instance: PackageView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.Bonus);
      if (instance.Items) {
        ListProxy.Serialize<number>(memoryStream, instance.Items, Int32Proxy.Serialize);
      } else {
        num |= 1;
      }
      if (instance.Name) {
        StringProxy.Serialize(memoryStream, instance.Name);
      } else {
        num |= 2;
      }
      DecimalProxy.Serialize(memoryStream, instance.Price);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): PackageView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let packageView: PackageView | null = null;
    if (num !== 0) {
      packageView = new PackageView();
      packageView.Bonus = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        packageView.Items = ListProxy.Deserialize<number>(bytes, Int32Proxy.Deserialize);
      }
      if ((num & 2) !== 0) {
        packageView.Name = StringProxy.Deserialize(bytes);
      }
      packageView.Price = DecimalProxy.Deserialize(bytes);
    }
    return packageView;
  }
}
