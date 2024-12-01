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

import { CurrencyDepositView } from '@/Cmune/DataCenter/Common/Entities';
import { CurrencyDepositsViewModel } from '@/UberStrike/Core/ViewModel';
import CurrencyDepositViewProxy from './CurrencyDepositViewProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';

export default class CurrencyDepositsViewModelProxy {
  static Serialize(stream: number[], instance: CurrencyDepositsViewModel): void {
    let num = 0;
    const memoryStream: number[] = [];
    if (instance.CurrencyDeposits) {
      ListProxy.Serialize<CurrencyDepositView>(
        memoryStream,
        instance.CurrencyDeposits,
        CurrencyDepositViewProxy.Serialize,
      );
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.TotalCount);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): CurrencyDepositsViewModel {
    const num = Int32Proxy.Deserialize(bytes);
    const currencyDepositsViewModel = new CurrencyDepositsViewModel();

    if ((num & 1) !== 0) {
      currencyDepositsViewModel.CurrencyDeposits = ListProxy.Deserialize<CurrencyDepositView>(
        bytes,
        CurrencyDepositViewProxy.Deserialize,
      );
    }

    currencyDepositsViewModel.TotalCount = Int32Proxy.Deserialize(bytes);

    return currencyDepositsViewModel;
  }
}
