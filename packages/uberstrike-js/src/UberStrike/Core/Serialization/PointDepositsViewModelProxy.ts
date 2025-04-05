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

import { PointDepositView } from '@/Cmune/DataCenter/Common/Entities';
import { PointDepositsViewModel } from '@/UberStrike/Core/ViewModel';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import PointDepositViewProxy from './PointDepositViewProxy';

export default class PointDepositsViewModelProxy {
  static Serialize(stream: number[], instance: PointDepositsViewModel): void {
    let num = 0;

    const memoryStream: number[] = [];
    if (instance.PointDeposits) {
      ListProxy.Serialize<PointDepositView>(memoryStream, instance.PointDeposits, PointDepositViewProxy.Serialize);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.TotalCount);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PointDepositsViewModel {
    const num = Int32Proxy.Deserialize(bytes);
    const pointDepositsViewModel = new PointDepositsViewModel();

    if ((num & 1) !== 0) {
      pointDepositsViewModel.PointDeposits = ListProxy.Deserialize<PointDepositView>(
        bytes,
        PointDepositViewProxy.Deserialize,
      );
    }

    pointDepositsViewModel.TotalCount = Int32Proxy.Deserialize(bytes);

    return pointDepositsViewModel;
  }
}
