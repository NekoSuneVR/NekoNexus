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

import { ApplicationRegistrationResult } from '@/Cmune/DataCenter/Common/Entities';
import { RegisterClientApplicationViewModel } from '@/UberStrike/Core/ViewModel';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';

export default class RegisterClientApplicationViewModelProxy {
  static Serialize(stream: number[], instance: RegisterClientApplicationViewModel): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      if (instance.ItemsAttributed) {
        ListProxy.Serialize<number>(memoryStream, instance.ItemsAttributed, Int32Proxy.Serialize);
      } else {
        num |= 1;
      }
      EnumProxy.Serialize<ApplicationRegistrationResult>(memoryStream, instance.Result);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): RegisterClientApplicationViewModel | null {
    const num = Int32Proxy.Deserialize(bytes);
    let registerClientApplicationViewModel: RegisterClientApplicationViewModel | null = null;
    if (num !== 0) {
      registerClientApplicationViewModel = new RegisterClientApplicationViewModel();
      if ((num & 1) !== 0) {
        registerClientApplicationViewModel.ItemsAttributed = ListProxy.Deserialize<number>(
          bytes,
          Int32Proxy.Deserialize,
        );
      }
      registerClientApplicationViewModel.Result = EnumProxy.Deserialize<ApplicationRegistrationResult>(bytes);
    }
    return registerClientApplicationViewModel;
  }
}
