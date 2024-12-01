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

import { AccountCompletionResultView } from '@/UberStrike/DataCenter/Common/Entities';
import DictionaryProxy from './DictionaryProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';

export default class AccountCompletionResultViewProxy {
  static Serialize(stream: number[], instance: AccountCompletionResultView): void {
    let num = 0;
    const memoryStream: number[] = [];

    if (instance.ItemsAttributed) {
      DictionaryProxy.Serialize<number, number>(
        memoryStream,
        instance.ItemsAttributed,
        Int32Proxy.Serialize,
        Int32Proxy.Serialize,
      );
    } else {
      num |= 1;
    }

    if (instance.NonDuplicateNames) {
      ListProxy.Serialize<string>(memoryStream, instance.NonDuplicateNames, StringProxy.Serialize);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(memoryStream, instance.Result);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): AccountCompletionResultView {
    const num = Int32Proxy.Deserialize(bytes);
    const accountCompletionResultView = new AccountCompletionResultView();

    if ((num & 1) !== 0) {
      accountCompletionResultView.ItemsAttributed = DictionaryProxy.Deserialize<number, number>(
        bytes,
        Int32Proxy.Deserialize,
        Int32Proxy.Deserialize,
      );
    }

    if ((num & 2) !== 0) {
      accountCompletionResultView.NonDuplicateNames = ListProxy.Deserialize<string>(bytes, StringProxy.Deserialize);
    }

    accountCompletionResultView.Result = Int32Proxy.Deserialize(bytes);

    return accountCompletionResultView;
  }
}
