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

import { ItemInventoryView } from '@/Cmune/DataCenter/Common/Entities';
import DateTimeProxy from '../DateTimeProxy';
import Int32Proxy from '../Int32Proxy';

export default class ItemInventoryViewProxy {
  static Serialize(stream: number[], instance: ItemInventoryView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.AmountRemaining);
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      if (instance.ExpirationDate) {
        DateTimeProxy.Serialize(memoryStream, instance.ExpirationDate);
      } else {
        num |= 1;
      }
      Int32Proxy.Serialize(memoryStream, instance.ItemId);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): ItemInventoryView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let itemInventoryView: ItemInventoryView | null = null;
    if (num !== 0) {
      itemInventoryView = new ItemInventoryView();
      itemInventoryView.AmountRemaining = Int32Proxy.Deserialize(bytes);
      itemInventoryView.Cmid = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        itemInventoryView.ExpirationDate = new Date() ?? DateTimeProxy.Deserialize(bytes);
      }
      itemInventoryView.ItemId = Int32Proxy.Deserialize(bytes);
    }
    return itemInventoryView;
  }
}
