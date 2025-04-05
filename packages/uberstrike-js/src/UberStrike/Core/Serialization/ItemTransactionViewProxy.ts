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

import { BuyingDurationType, ItemTransactionView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import DateTimeProxy from './DateTimeProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';

export default class ItemTransactionViewProxy {
  static Serialize(stream: number[], instance: ItemTransactionView): void {
    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    Int32Proxy.Serialize(memoryStream, instance.Credits);
    EnumProxy.Serialize<BuyingDurationType>(memoryStream, instance.Duration);
    BooleanProxy.Serialize(memoryStream, instance.IsAdminAction);
    Int32Proxy.Serialize(memoryStream, instance.ItemId);
    Int32Proxy.Serialize(memoryStream, instance.Points);
    DateTimeProxy.Serialize(memoryStream, instance.WithdrawalDate);
    Int32Proxy.Serialize(memoryStream, instance.WithdrawalId);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): ItemTransactionView {
    return new ItemTransactionView({
      Cmid: Int32Proxy.Deserialize(bytes),
      Credits: Int32Proxy.Deserialize(bytes),
      Duration: EnumProxy.Deserialize<BuyingDurationType>(bytes),
      IsAdminAction: BooleanProxy.Deserialize(bytes),
      ItemId: Int32Proxy.Deserialize(bytes),
      Points: Int32Proxy.Deserialize(bytes),
      WithdrawalDate: DateTimeProxy.Deserialize(bytes),
      WithdrawalId: Int32Proxy.Deserialize(bytes),
    });
  }
}
