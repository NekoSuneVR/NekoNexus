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

import { PlaySpanHashesViewModel } from '@/UberStrike/Core/ViewModel';
import DecimalProxy from './DecimalProxy';
import DictionaryProxy from './DictionaryProxy';
import Int32Proxy from './Int32Proxy';
import StringProxy from './StringProxy';

export default class PlaySpanHashesViewModelProxy {
  static Serialize(stream: number[], instance: PlaySpanHashesViewModel): void {
    let num = 0;

    const memoryStream: number[] = [];
    if (instance.Hashes) {
      DictionaryProxy.Serialize<number, string>(
        memoryStream,
        instance.Hashes,
        DecimalProxy.Serialize,
        StringProxy.Serialize,
      );
    } else {
      num |= 1;
    }

    if (instance.MerchTrans) {
      StringProxy.Serialize(memoryStream, instance.MerchTrans);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PlaySpanHashesViewModel {
    const num = Int32Proxy.Deserialize(bytes);
    const playSpanHashesViewModel = new PlaySpanHashesViewModel();

    if ((num & 1) !== 0) {
      playSpanHashesViewModel.Hashes = DictionaryProxy.Deserialize<number, string>(
        bytes,
        DecimalProxy.Deserialize,
        StringProxy.Deserialize,
      );
    }

    if ((num & 2) !== 0) {
      playSpanHashesViewModel.MerchTrans = StringProxy.Deserialize(bytes);
    }

    return playSpanHashesViewModel;
  }
}
