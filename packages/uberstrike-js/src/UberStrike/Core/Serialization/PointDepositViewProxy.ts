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

import { PointDepositView, PointsDepositType } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import DateTimeProxy from './DateTimeProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';

export default class PointDepositViewProxy {
  static Serialize(stream: number[], instance: PointDepositView): void {
    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.Cmid);
    DateTimeProxy.Serialize(memoryStream, instance.DepositDate);
    EnumProxy.Serialize<PointsDepositType>(memoryStream, instance.DepositType);
    BooleanProxy.Serialize(memoryStream, instance.IsAdminAction);
    Int32Proxy.Serialize(memoryStream, instance.PointDepositId);
    Int32Proxy.Serialize(memoryStream, instance.Points);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PointDepositView {
    return new PointDepositView({
      Cmid: Int32Proxy.Deserialize(bytes),
      DepositDate: DateTimeProxy.Deserialize(bytes),
      DepositType: EnumProxy.Deserialize<PointsDepositType>(bytes),
      IsAdminAction: BooleanProxy.Deserialize(bytes),
      PointDepositId: Int32Proxy.Deserialize(bytes),
      Points: Int32Proxy.Deserialize(bytes),
    });
  }
}
